-- 1. STAFF
CREATE TABLE staff (
    staff_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name      VARCHAR(150) NOT NULL,
    phone          VARCHAR(20)  NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    is_deleted     BOOLEAN      NOT NULL DEFAULT FALSE,   -- logical delete
    CONSTRAINT ck_staff_email CHECK (email ~* '^[^@[:space:]]+@ucb\.edu\.bo$')
);

-- 2. LOST OBJECT
CREATE TABLE lost_object (
    object_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description          VARCHAR(500) NOT NULL,
    found_date           DATE         NOT NULL,
    found_location       VARCHAR(200) NOT NULL,
    status               VARCHAR(10)  NOT NULL DEFAULT 'found',
    pickup_date          DATE         NULL,
    picked_up_by_name    VARCHAR(150) NULL,
    picked_up_by_ci      VARCHAR(20)  NULL,
    picked_up_by_career  VARCHAR(100) NULL,
    picked_up_by_phone   VARCHAR(20)  NULL,

    CONSTRAINT ck_lost_object_status CHECK (status IN ('found', 'picked_up')),
    CONSTRAINT ck_lost_object_pickup_date CHECK (pickup_date IS NULL OR pickup_date >= found_date),
    -- pickup data is required when picked up, and must be empty when still found
    CONSTRAINT ck_lost_object_pickup_data CHECK (
        (status = 'found'
            AND pickup_date IS NULL
            AND picked_up_by_name IS NULL
            AND picked_up_by_ci IS NULL
            AND picked_up_by_career IS NULL
            AND picked_up_by_phone IS NULL)
        OR
        (status = 'picked_up'
            AND pickup_date IS NOT NULL
            AND picked_up_by_name IS NOT NULL
            AND picked_up_by_ci IS NOT NULL
            AND picked_up_by_career IS NOT NULL
            AND picked_up_by_phone IS NOT NULL)
    )
);

-- 3. CATEGORY
CREATE TABLE category (
    category_id  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(80) NOT NULL UNIQUE   -- backpacks, electronics, coats, pants...
);

-- 4. STAFF <-> OBJECT (who registered which object)
CREATE TABLE staff_object (
    object_id      INT       NOT NULL PRIMARY KEY,  -- an object is registered once
    staff_id       INT       NOT NULL,
    registered_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (object_id) REFERENCES lost_object(object_id),
    FOREIGN KEY (staff_id)  REFERENCES staff(staff_id)
);

-- 5. OBJECT <-> CATEGORY
CREATE TABLE object_category (
    object_id    INT NOT NULL,
    category_id  INT NOT NULL,
    PRIMARY KEY (object_id, category_id),
    FOREIGN KEY (object_id)   REFERENCES lost_object(object_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);