-- Connect to the default database first
\c postgres;

-- Create the database for development if it doesn't already exist
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'blockchain_tracker_dev') THEN
        CREATE DATABASE blockchain_tracker_dev;
    END IF;
END
$$;

-- Connect to the blockchain_tracker_dev database
\c blockchain_tracker_dev;

-- Create the 'price' table if it does not exist
CREATE TABLE IF NOT EXISTS price (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,  -- Chain (e.g., 'ethereum', 'polygon')
    price FLOAT NOT NULL,        -- Price in USD
    createdAt TIMESTAMP DEFAULT NOW()  -- Timestamp for when the price was fetched
);

-- Create the 'alert' table if it does not exist
CREATE TABLE IF NOT EXISTS alert (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,  -- Chain (e.g., 'ethereum', 'polygon')
    targetPrice FLOAT NOT NULL,  -- Target price for the alert
    email VARCHAR(255) NOT NULL, -- User email to notify
    createdAt TIMESTAMP DEFAULT NOW()  -- Timestamp for when the alert was created
);
