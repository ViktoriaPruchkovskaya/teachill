-- Groups table represent university/school/college studying group.
CREATE TABLE IF NOT EXISTS groups
(
    id   INT PRIMARY KEY,
    name VARCHAR(1024) NOT NULL UNIQUE
);

-- Table define type of lessons (seminar, lecture, etc.)
CREATE TABLE IF NOT EXISTS lesson_types
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(1024) NOT NULL
);

-- Table define teacher entity
CREATE TABLE IF NOT EXISTS teachers
(
    id        SERIAL PRIMARY KEY,
    full_name VARCHAR(1024) NOT NULL
);

-- Lesson table define structure of single lesson entity.
CREATE TABLE IF NOT EXISTS lessons
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(1024) NOT NULL,
    description VARCHAR(4096) NOT NULL DEFAULT '',
    type_id     INT           NOT NULL REFERENCES lesson_types,
    location    VARCHAR(1024),
    start_time  TIMESTAMP     NOT NULL,
    duration    INT           NOT NULL
);

CREATE TABLE IF NOT EXISTS attachments
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(1024),
    url  VARCHAR(2048) NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_teachers
(
    lesson_id  INT NOT NULL REFERENCES lessons,
    teacher_id INT NOT NULL REFERENCES teachers,

    CONSTRAINT lesson_teachers_pk PRIMARY KEY (lesson_id, teacher_id)
);

CREATE TABLE IF NOT EXISTS lesson_attachments
(
    lesson_id     INT NOT NULL REFERENCES lessons,
    attachment_id INT NOT NULL REFERENCES attachments,

    CONSTRAINT lesson_attachments_pk PRIMARY KEY (lesson_id, attachment_id)
);

CREATE TABLE IF NOT EXISTS user_groups
(
    user_id  INT NOT NULL REFERENCES users,
    group_id INT NOT NULL REFERENCES groups,

    CONSTRAINT user_groups_pk PRIMARY KEY (user_id, group_id)
);

CREATE TABLE IF NOT EXISTS lesson_groups
(
    lesson_id  INT NOT NULL REFERENCES lessons,
    group_id   INT NOT NULL REFERENCES groups,

    CONSTRAINT lesson_groups_pk PRIMARY KEY (lesson_id, group_id)
);
