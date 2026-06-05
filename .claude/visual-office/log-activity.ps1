<#
.SYNOPSIS
  Append a Visual Office activity entry with the REAL current time.

.DESCRIPTION
  Elysia เรียก script นี้แทนการพิมพ์ timestamp มือ — กัน bug "เวลาปลอม/hardcode"
  (เจอ Session 010). เวลามาจาก Get-Date จริงเสมอ, เขียนไฟล์เป็น UTF-8 no BOM
  เพื่อให้ JSON.parse บนหน้า office.html อ่านได้ (PS5.1 Add-Content -Encoding utf8
  จะใส่ BOM ทำให้ JSON พัง — จึงใช้ .NET AppendAllText).

.PARAMETER Agent
  ชื่อ agent: Elysia | Sakura | Mobius | Aponia

.PARAMETER Action
  ข้อความสั้น ๆ ว่าทำอะไร (ไทย/อังกฤษได้)

.EXAMPLE
  .\log-activity.ps1 -Agent Elysia -Action "เริ่ม Session 011 — แก้บั๊กเวลา feed"
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('Elysia', 'Sakura', 'Mobius', 'Aponia')]
  [string]$Agent,

  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Action
)

# เวลาจริงในรูปแบบ ISO 8601 + offset เครื่อง (เช่น 2026-06-03T19:25:07+07:00)
$time = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"

# ใช้ [ordered] เพื่อคุมลำดับ key (time, agent, action) + ConvertTo-Json -Compress
# เพื่อ escape อักขระพิเศษ (", \) ให้ถูกต้องโดยอัตโนมัติ และได้บรรทัดเดียว
$entry = [ordered]@{
  time   = $time
  agent  = $Agent
  action = $Action
}
$line = $entry | ConvertTo-Json -Compress

# append แบบ UTF-8 no BOM (ห้ามใช้ Add-Content -Encoding utf8 — ใส่ BOM พัง JSON)
$logPath = Join-Path $PSScriptRoot 'activity_log.jsonl'
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::AppendAllText($logPath, $line + "`r`n", $enc)

Write-Host "logged -> $line"
