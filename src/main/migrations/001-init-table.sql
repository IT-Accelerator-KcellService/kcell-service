-- Таблица офисов
CREATE TABLE IF NOT EXISTS offices (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) UNIQUE NOT NULL
);

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    office_id INT REFERENCES offices(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'admin-worker', 'department-head', 'executor', 'manager'))
);

-- Категории услуг
CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Исполнители
CREATE TABLE IF NOT EXISTS executors (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0.0,
    workload INT DEFAULT 0
);

-- Заявки
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    request_id_display VARCHAR(20) UNIQUE NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('Обычная', 'Экстренная', 'Плановая', 'Сложная')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_id INT REFERENCES users(id) ON DELETE SET NULL,
    office_id INT REFERENCES offices(id) ON DELETE SET NULL,
    location_detail VARCHAR(255),
    date_submitted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (
    status IN (
    'Новая', 'В обработке', 'Исполнение', 'Завершено',
    'Ожидает назначения', 'Ожидает SLA', 'Назначена', 'В работе', 'Запланирована'
    )),
    category_id INT REFERENCES service_categories(id) ON DELETE SET NULL,
    complexity VARCHAR(50) CHECK (complexity IN ('Простая', 'Средняя', 'Сложная')),
    sla VARCHAR(50),
    executor_id INT REFERENCES executors(id) ON DELETE SET NULL,
    admin_worker_id INT REFERENCES users(id) ON DELETE SET NULL,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    planned_completion_date DATE,
    actual_completion_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- Фотографии заявок
CREATE TABLE IF NOT EXISTS request_photos (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    photo_url VARCHAR(255) NOT NULL
);

-- Сообщения чата по заявкам
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
