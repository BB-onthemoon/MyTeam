<#
.SYNOPSIS
  Update Visual Office office_status.json safely, with the REAL current time.

.DESCRIPTION
  Elysia is the single writer of office_status.json. Writing the whole file by hand
  every step is error-prone (Session 014: status stuck at "Step 1" because only the
  activity log got updated). This script edits ONLY the fields you pass; everything
  else is kept, and updated_at is ALWAYS set to the real Get-Date time automatically
  so the timestamp can never be forgotten/hardcoded (pairs with log-activity.ps1).

  Source is kept ASCII-only on purpose: PowerShell 5.1 reads a UTF-8 (no BOM) .ps1 as
  the ANSI codepage, and Thai characters in the source were observed to break parsing
  (Session 014). Thai DATA is fine when passed as runtime arguments (-Task "...").

  The file is written as UTF-8 no BOM (like log-activity.ps1) so fetch + JSON.parse in
  office.html can read it. Thai data is kept as real characters (not \uXXXX) by
  unescaping only \uXXXX sequences after ConvertTo-Json.

.PARAMETER Agent
  Agent to change: Elysia | Sakura | Mobius | Aponia (use with -Status and/or -Task)

.PARAMETER Status
  New agent status: idle | working | waiting | reviewing | done

.PARAMETER Task
  Task text the agent is doing ("" clears the task). Thai is fine here (runtime arg).

.PARAMETER Session
  Session number, e.g. "014"

.PARAMETER Step
  Current step number (integer)

.PARAMETER Label
  Short step_label describing the current step

.EXAMPLE
  .\set-status.ps1 -Agent Elysia -Status working -Task "Step 3: wall ratio"

.EXAMPLE
  .\set-status.ps1 -Step 3 -Label "responsive room-h"

.EXAMPLE
  .\set-status.ps1 -Agent Mobius -Status idle -Task ""
#>
[CmdletBinding()]
param(
  [ValidateSet('Elysia', 'Sakura', 'Mobius', 'Aponia')]
  [string]$Agent,

  [ValidateSet('idle', 'working', 'waiting', 'reviewing', 'done')]
  [string]$Status,

  [string]$Task,

  [string]$Session,

  [int]$Step,

  [string]$Label
)

$statusPath = Join-Path $PSScriptRoot 'office_status.json'

if (-not (Test-Path $statusPath)) {
  Write-Error "File not found: $statusPath"
  exit 1
}

# ---- load existing json (read as UTF-8) ----
$raw = Get-Content -Path $statusPath -Raw -Encoding UTF8
try {
  $obj = $raw | ConvertFrom-Json
} catch {
  Write-Error "office_status.json parse failed: $($_.Exception.Message)"
  exit 1
}

# ---- guard: -Status / -Task require -Agent ----
$touchStatus = $PSBoundParameters.ContainsKey('Status')
$touchTask   = $PSBoundParameters.ContainsKey('Task')
if (($touchStatus -or $touchTask) -and -not $Agent) {
  Write-Error "-Status/-Task require -Agent"
  exit 1
}

# ---- change only the fields passed (keep the rest) ----
if ($PSBoundParameters.ContainsKey('Session')) { $obj.current_session = $Session }
if ($PSBoundParameters.ContainsKey('Step'))    { $obj.current_step = $Step }
if ($PSBoundParameters.ContainsKey('Label'))   { $obj.step_label = $Label }

if ($Agent) {
  if (-not $obj.agents.$Agent) {
    Write-Error "agent '$Agent' not found in office_status.json"
    exit 1
  }
  if ($touchStatus) { $obj.agents.$Agent.status = $Status }
  if ($touchTask)   { $obj.agents.$Agent.task = $Task }
}

# ---- updated_at = always the real time (no hardcode/forget, rule S011) ----
$obj.updated_at = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"

# ---- serialize -> JSON (PS5.1 escapes non-ASCII to \uXXXX) ----
$json = $obj | ConvertTo-Json -Depth 6

# unescape ONLY \uXXXX back to real characters (keeps other backslashes intact,
# unlike Regex.Unescape which would also eat \n \t \\ etc.)
$json = [regex]::Replace($json, '\\u([0-9a-fA-F]{4})', {
  param($m) [char][int]('0x' + $m.Groups[1].Value)
})

# ---- overwrite as UTF-8 no BOM ----
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($statusPath, $json, $enc)

Write-Host "status updated -> session=$($obj.current_session) step=$($obj.current_step) updated_at=$($obj.updated_at)"
if ($Agent) {
  Write-Host "  $Agent -> status=$($obj.agents.$Agent.status) task=$($obj.agents.$Agent.task)"
}
