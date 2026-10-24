Add-Type -AssemblyName System.Drawing

$srcPath = [System.IO.Path]::GetFullPath('public/images/rings-logo.png')
$icoPath = [System.IO.Path]::GetFullPath('public/favicon.ico')
$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)

$sizes = @(16, 32, 48, 64, 128, 256)
$pngBytesList = @()

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcImg, 0, 0, $sz, $sz)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,@($sz, $ms.ToArray())
    
    # Also save standard standalone PNGs for modern web standards
    if ($sz -eq 16) { $bmp.Save([System.IO.Path]::GetFullPath('public/favicon-16x16.png'), [System.Drawing.Imaging.ImageFormat]::Png) }
    if ($sz -eq 32) { $bmp.Save([System.IO.Path]::GetFullPath('public/favicon-32x32.png'), [System.Drawing.Imaging.ImageFormat]::Png) }

    $ms.Dispose()
    $bmp.Dispose()
}

# Apple Touch Icon 180x180
$appleBmp = New-Object System.Drawing.Bitmap(180, 180, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$appleG = [System.Drawing.Graphics]::FromImage($appleBmp)
$appleG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$appleG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$appleG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$appleG.Clear([System.Drawing.Color]::FromArgb(255, 20, 18, 15)) # Dark wedding luxury background for iOS homescreen
# Center rings icon with slight padding
$padding = 20
$appleG.DrawImage($srcImg, $padding, $padding, 180 - ($padding * 2), 180 - ($padding * 2))
$appleG.Dispose()
$appleBmp.Save([System.IO.Path]::GetFullPath('public/apple-touch-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$appleBmp.Dispose()

$srcImg.Dispose()

# Create ICO file with all resolution frames
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONDIR
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1=ICO)
$bw.Write([uint16]$pngBytesList.Count) # Image count

$offset = 6 + ($pngBytesList.Count * 16)

foreach ($item in $pngBytesList) {
    $sz = $item[0]
    $bytes = $item[1]
    $wByte = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
    $hByte = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }

    # ICONDIRENTRY
    $bw.Write($wByte) # Width
    $bw.Write($hByte) # Height
    $bw.Write([byte]0) # Color count
    $bw.Write([byte]0) # Reserved
    $bw.Write([uint16]1) # Color planes
    $bw.Write([uint16]32) # Bits per pixel
    $bw.Write([uint32]$bytes.Length) # Image size in bytes
    $bw.Write([uint32]$offset) # Offset to image

    $offset += $bytes.Length
}

foreach ($item in $pngBytesList) {
    $bw.Write($item[1])
}

$bw.Flush()
$bw.Close()
$fs.Close()

Write-Host "Favicon ICO, PNGs, and Apple Touch Icon generated successfully!"
