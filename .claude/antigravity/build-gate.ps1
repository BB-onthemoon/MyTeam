# build-gate.ps1 -- Antigravity hybrid team BUILD GATE (Layer 2: Elysia safety net)
#
# WHAT: Run AFTER Bronya returns work, BEFORE Elysia spawns Aponia/Sakura QA.
#       Catches the S031 failure mode: "Bronya said DONE but ng build was broken
#       / forgot the report".
#
# CHECKS (in order):
#   1. _bronya_report.md exists at project root         -> else GATE: FAIL (no report)
#   2. JSON status block at end of report parses          -> else GATE: FAIL (bad json)
#   3. If Bronya status == BLOCKED -> stop, surface to Owner (no build run)
#   4. ng build passes (exit 0)                           -> else GATE: FAIL (build)
#   5. all good                                           -> GATE: PASS
#
# USAGE:
#   powershell -ExecutionPolicy Bypass -File _agy_bridge/build-gate.ps1 -ProjectPath "practice/git-visualizer"
#
# NOTE (ASCII-only source per team PS5.1 lesson S014): no Thai in this file.

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
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

# --- check 4: ng build -----------------------------------------------------
if (-not (Test-Path $pkgPath)) {
    Write-Verdict "GATE: FAIL (no package.json) -- '$ProjectPath' is not a node/Angular project."
    exit 6
}

# Use development configuration: skips minify/optimize (faster) but still runs
# full AOT type + template checking -- the actual S031 failure modes. (Bronya's
# suggestion, dogfood meeting S032.) Known blind spot: this does NOT catch
# runtime / logic / lint errors -- only compile/type/template. Add ng lint as a
# later gate layer if runtime breakage recurs.
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

# --- pass ------------------------------------------------------------------
$nr = ($report.needs_review -join "; ")
Write-Verdict "GATE: PASS -- build clean, report present (status=$status). needs_review: $nr"
exit 0
