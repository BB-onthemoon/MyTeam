# build-gate.ps1 -- Antigravity hybrid team BUILD GATE (Layer 2: Elysia safety net)
#
# WHAT: Run AFTER Bronya returns work, BEFORE Elysia spawns Aponia/Sakura QA.
#       Catches the S031 failure mode: "Bronya said DONE but build was broken
#       / forgot the report".
#
# MODES (S038 FullStack):
#   -Mode frontend (default) -> ng build --configuration development (Angular)
#   -Mode backend            -> npx tsc --noEmit (Express/TS) + optional endpoint smoke test
#
# SHARED CHECKS (both modes, in order):
#   1. _bronya_report.md exists at project root         -> else GATE: FAIL (no report)
#   2. JSON status block at end of report parses          -> else GATE: FAIL (bad json)
#   3. If Bronya status == BLOCKED -> stop, surface to Owner (no build run)
#   4. build/type check passes (per mode)                 -> else GATE: FAIL
#   5. backend only + -SmokeUrl set: server starts + URL returns 200 -> else FAIL (smoke)
#   6. all good                                           -> GATE: PASS
#
# USAGE:
#   # frontend (Angular) -- unchanged
#   powershell -ExecutionPolicy Bypass -File .claude/antigravity/build-gate.ps1 -ProjectPath "practice/git-visualizer"
#   # backend (Express/TS) -- tsc only
#   powershell -ExecutionPolicy Bypass -File .claude/antigravity/build-gate.ps1 -ProjectPath "practice/fifa-worldcup/backend" -Mode backend
#   # backend + live endpoint smoke test (opt-in)
#   powershell ... -ProjectPath "practice/fifa-worldcup/backend" -Mode backend -SmokeUrl "http://localhost:3000/api/matches" -StartCmd "npm start"
#
# NOTE (ASCII-only source per team PS5.1 lesson S014): no Thai in this file.

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [ValidateSet("frontend", "backend")]
    [string]$Mode = "frontend",

    # backend smoke test (opt-in): if set, start the server and expect 200 from this URL
    [string]$SmokeUrl = "",
    [string]$StartCmd = "npm start",
    [int]$SmokeTimeoutSec = 25
)

$ErrorActionPreference = "Stop"

function Write-Verdict {
    param([string]$Line)
    Write-Host ""
    Write-Host "==================================================="
    Write-Host $Line
    Write-Host "==================================================="
}

# --- resolve paths ---------------------------------------------------------
if (-not (Test-Path $ProjectPath)) {
    Write-Verdict "GATE: FAIL (bad path) -- '$ProjectPath' not found"
    exit 2
}
$projFull   = (Resolve-Path $ProjectPath).Path
$reportPath = Join-Path $projFull "_bronya_report.md"
$pkgPath    = Join-Path $projFull "package.json"

Write-Host "[build-gate] mode    : $Mode"
Write-Host "[build-gate] project : $projFull"

# --- check 1: report exists ------------------------------------------------
if (-not (Test-Path $reportPath)) {
    Write-Verdict "GATE: FAIL (no report) -- _bronya_report.md missing. Bronya skipped the handoff protocol."
    exit 3
}
Write-Host "[build-gate] report  : found _bronya_report.md"

# --- check 2: parse JSON status block (last fenced ```json block) ----------
$reportRaw = Get-Content -Raw -Path $reportPath
$jsonMatches = [regex]::Matches($reportRaw, '(?s)```json\s*(.*?)```')
if ($jsonMatches.Count -eq 0) {
    Write-Verdict "GATE: FAIL (bad json) -- no fenced json status block found in report."
    exit 4
}
$jsonText = $jsonMatches[$jsonMatches.Count - 1].Groups[1].Value
try {
    $report = $jsonText | ConvertFrom-Json
} catch {
    Write-Verdict "GATE: FAIL (bad json) -- json block did not parse: $($_.Exception.Message)"
    exit 4
}
$status = "$($report.status)".Trim()
Write-Host "[build-gate] bronya  : status = '$status'"

# --- check 3: BLOCKED short-circuits (no point building) -------------------
if ($status -eq "BLOCKED") {
    $blk = ($report.blockers -join "; ")
    Write-Verdict "GATE: BLOCKED -- Bronya is blocked, no build run. Blockers: $blk"
    exit 5
}

# --- check 4: build / type check (per mode) --------------------------------
if (-not (Test-Path $pkgPath)) {
    Write-Verdict "GATE: FAIL (no package.json) -- '$ProjectPath' is not a node project."
    exit 6
}

if ($Mode -eq "frontend") {
    # Angular: development configuration skips minify/optimize (faster) but still
    # runs full AOT type + template checking -- the actual S031 failure modes.
    # Known blind spot: does NOT catch runtime / logic / lint errors.
    Write-Host "[build-gate] build   : running 'npx ng build --configuration development' ..."
    Push-Location $projFull
    try {
        & npx ng build --configuration development
        $buildExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    if ($buildExit -ne 0) {
        Write-Verdict "GATE: FAIL (build) -- ng build exited $buildExit. Bounce errors back to Bronya (max 2 rounds, then escalate to Owner)."
        exit 1
    }
}
else {
    # Backend (Express/TS): tsc --noEmit = full type check, no output, never hangs.
    # Blind spot: does NOT catch runtime / logic / SQL errors -- those are Self-QA
    # (Bronya) + backend QA (Aponia). Optional -SmokeUrl adds a live 200 check.
    $tsconfig = Join-Path $projFull "tsconfig.json"
    if (-not (Test-Path $tsconfig)) {
        Write-Verdict "GATE: FAIL (no tsconfig) -- backend mode needs tsconfig.json in '$ProjectPath'."
        exit 6
    }
    Write-Host "[build-gate] tsc     : running 'npx tsc --noEmit' ..."
    Push-Location $projFull
    try {
        & npx tsc --noEmit
        $tscExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    if ($tscExit -ne 0) {
        Write-Verdict "GATE: FAIL (tsc) -- tsc --noEmit exited $tscExit. Type errors. Bounce back to Bronya (max 2 rounds, then Owner)."
        exit 1
    }

    # --- check 5: optional endpoint smoke test -----------------------------
    if ($SmokeUrl -ne "") {
        Write-Host "[build-gate] smoke   : starting server ('$StartCmd') for live check at $SmokeUrl ..."
        $serverProc = $null
        $smokeOk = $false
        try {
            # Start the server detached so we can poll, then kill its whole tree.
            $serverProc = Start-Process -FilePath "cmd.exe" `
                -ArgumentList "/c", $StartCmd `
                -WorkingDirectory $projFull -PassThru -WindowStyle Hidden
            $deadline = (Get-Date).AddSeconds($SmokeTimeoutSec)
            while ((Get-Date) -lt $deadline) {
                Start-Sleep -Milliseconds 800
                try {
                    $resp = Invoke-WebRequest -Uri $SmokeUrl -UseBasicParsing -TimeoutSec 4
                    if ($resp.StatusCode -eq 200) { $smokeOk = $true; break }
                } catch {
                    # server not up yet (connection refused) -- keep polling
                }
            }
        } finally {
            if ($serverProc -and -not $serverProc.HasExited) {
                # taskkill /T kills child node processes spawned by npm (orphan-safe)
                & taskkill /PID $serverProc.Id /T /F 2>$null | Out-Null
            }
        }
        if (-not $smokeOk) {
            Write-Verdict "GATE: FAIL (smoke) -- $SmokeUrl did not return 200 within ${SmokeTimeoutSec}s. Check server start / route / port."
            exit 7
        }
        Write-Host "[build-gate] smoke   : OK -- $SmokeUrl returned 200"
    }
}

# --- pass ------------------------------------------------------------------
$nr = ($report.needs_review -join "; ")
Write-Verdict "GATE: PASS ($Mode) -- checks clean, report present (status=$status). needs_review: $nr"
exit 0
