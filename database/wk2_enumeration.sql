CREATE TYPE public."account_type" AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public."account_types"
    OWNER TO cse340;