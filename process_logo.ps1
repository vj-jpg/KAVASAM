Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

$srcPath = "C:\Users\VIJAY\.gemini\antigravity\brain\00c75902-3ef7-4664-950b-acc0e4150e7c\.user_uploaded\media_1788890694909.png"
$origDest = Join-Path $assetsDir "logo_original.png"
Copy-Item $srcPath $origDest -Force

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$targetBmp = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        $brightness = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        if ($brightness -lt 45) {
            $targetBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Make the white text crisp and vibrant
            $alpha = [Math]::Min(255, [int]($brightness * 1.5))
            $targetBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
        }
    }
}

$destPath = Join-Path $assetsDir "logo.png"
$targetBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$targetBmp.Dispose()

Write-Host "Processed transparent logo saved at: $destPath"
