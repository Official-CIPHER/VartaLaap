cd backend

echo "Cleaning node_modules and lock file..."
rm -rf node_modules
rm -f package-lock.json

echo "Installing fresh dependencies..."
npm install

echo "Starting the server..."
npm start