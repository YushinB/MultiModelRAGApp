# deploy-frontend.ps1

$frontendDir = Join-Path $PSScriptRoot "frontend"
$envFile = Join-Path $frontendDir ".env"
$envLocalFile = Join-Path $frontendDir ".env.local"
$port = 3000 # Default port

# Function to parse env file
function Get-EnvVariable {
    param (
        [string]$filePath,
        [string]$variableName
    )
    if (Test-Path $filePath) {
        $content = Get-Content $filePath
        foreach ($line in $content) {
            if ($line -match "^$variableName=(.*)$") {
                return $matches[1].Trim()
            }
        }
    }
    return $null
}

# Check .env.local first, then .env
$envPort = Get-EnvVariable -filePath $envLocalFile -variableName "PORT"
if (-not $envPort) {
    $envPort = Get-EnvVariable -filePath $envFile -variableName "PORT"
}

if ($envPort) {
    $port = $envPort
    Write-Host "Found PORT in env file: $port" -ForegroundColor Green
} else {
    Write-Host "PORT not found in env files. Using default: $port" -ForegroundColor Yellow
}

# Navigate to frontend directory
Push-Location $frontendDir

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

# Start the development server
Write-Host "Starting frontend server on port $port..." -ForegroundColor Cyan
# Pass the port to vite. Note: Vite uses --port flag.
# We use -- to pass arguments to the underlying command in npm run
npm run dev -- --port $port

Pop-Location
