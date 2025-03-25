-- Create Schools
INSERT INTO schools (id, name, code, description, domain, contact_email, contact_phone, timezone, address, settings, logo_url, subscription_status, max_students, max_teachers, is_active, is_deleted, created_at, updated_at)
VALUES 
    ('f302ee95-4d06-4b87-8d3e-916aefd0cd01', 'Oakwood Academy', 'OAKWOOD', 'A leading K-12 institution', 'oakwood-academy.edu', 'admin@oakwood-academy.edu', '123-456-7890', 'America/New_York', '123 Education Ave, Boston, MA', '{"theme": "blue", "features": ["attendance", "grades"]}', 'https://example.com/logos/oakwood.png', 'active', 1000, 50, true, false, NOW(), NOW()),
    ('2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', 'Sunnyvale High School', 'SUNNYVALE', 'Innovative high school with tech focus', 'sunnyvale-high.edu', 'admin@sunnyvale-high.edu', '234-567-8901', 'America/Los_Angeles', '456 Learning Blvd, San Francisco, CA', '{"theme": "green", "features": ["attendance", "grades", "library"]}', 'https://example.com/logos/sunnyvale.png', 'active', 800, 40, true, false, NOW(), NOW());

-- Create School Settings
INSERT INTO school_settings (id, school_id, academic_year_start, grading_system, attendance_rules, class_schedule_settings, notification_preferences, is_active, is_deleted, created_at, updated_at)
VALUES 
    ('beae61aa-56d3-4a9b-81d0-72d096f8431a', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '2023-09-01', '{"scale": "letter", "passing_grade": "D"}', '{"min_attendance": 0.75}', '{"periods": 8, "duration_minutes": 45}', '{"email": true, "sms": false}', true, false, NOW(), NOW()),
    ('73b0151c-20c2-49e7-a160-07f08cfa0517', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', '2023-08-15', '{"scale": "percentage", "passing_grade": 60}', '{"min_attendance": 0.8}', '{"periods": 7, "duration_minutes": 50}', '{"email": true, "sms": true}', true, false, NOW(), NOW());

-- Create Subscriptions
INSERT INTO subscriptions (id, school_id, plan_type, starts_at, ends_at, status, billing_cycle, payment_method, billing_details, is_active, is_deleted, created_at, updated_at)
VALUES 
    ('470c8dee-7493-497d-8740-11bf5c86cf95', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', 'standard', '2023-01-01 00:00:00', '2024-01-01 00:00:00', 'active', 'annually', '{"type": "credit_card", "last4": "1234"}', '{"address": "123 Billing St", "contact": "finance@oakwood.edu"}', true, false, NOW(), NOW()),
    ('62d7c77f-985a-480f-a0a5-b9336a6e9d9b', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', 'premium', '2023-01-15 00:00:00', '2024-01-15 00:00:00', 'active', 'annually', '{"type": "credit_card", "last4": "5678"}', '{"address": "456 Invoice Ave", "contact": "accounts@sunnyvale.edu"}', true, false, NOW(), NOW());

-- Create Users (with different roles)
INSERT INTO users (id, email, password, first_name, last_name, role, school_id, settings, is_active, is_deleted, created_at, updated_at)
VALUES 
    -- Super Admin
    ('550a8775-1414-4206-ae7d-61625d8e4267', 'superadmin1@example.com', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Super', 'Admin', 'super_admin', NULL, '{"theme": "dark"}', true, false, NOW(), NOW()),
    ('d4d591c6-d066-44cb-9e74-0ac2de5afee9', 'admin@example.com', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Peter', 'Griffin', 'super_admin', NULL, '{"theme": "dark"}', true, false, NOW(), NOW()),
    
    -- School Admins
    ('26f9c519-c5ce-4cd1-a88a-2cd8ecb7f48d', 'admin@oakwood-academy.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Jane', 'Principal', 'school_admin', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '{"notifications": true}', true, false, NOW(), NOW()),
    ('ac11adc5-f868-41c1-bea4-f67c89db97df', 'admin@sunnyvale-high.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Robert', 'Director', 'school_admin', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', '{"notifications": true}', true, false, NOW(), NOW()),
    
    -- Teachers
    ('750d3774-8c9e-49e6-9e8b-d368b383c09b', 'teacher1@oakwood-academy.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Michael', 'Smith', 'teacher', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '{"class_reminders": true}', true, false, NOW(), NOW()),
    ('98eed427-498b-4b20-8afc-22eff5c045a6', 'teacher2@sunnyvale-high.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Sarah', 'Johnson', 'teacher', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', '{"class_reminders": true}', true, false, NOW(), NOW()),
    
    -- Students
    ('d2108025-f337-4d51-a168-275c1d490d5d', 'student1@oakwood-academy.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Emma', 'Wilson', 'student', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '{"homework_reminders": true}', true, false, NOW(), NOW()),
    ('a78daaca-b563-4fe0-bdfd-5d0b2edb3b41', 'student2@oakwood-academy.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'James', 'Davis', 'student', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '{"homework_reminders": false}', true, false, NOW(), NOW()),
    ('eee7ea06-33ed-4e5b-8230-cd799d18ca8b', 'student3@sunnyvale-high.edu', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'Olivia', 'Miller', 'student', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', '{"homework_reminders": true}', true, false, NOW(), NOW()),
    
    -- Individual User (D2C)
    ('3b280a98-06b0-45d8-8cc7-8d589d47ba32', 'individual1@example.com', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'David', 'Brown', 'individual_user', NULL, '{"newsletter": true}', true, false, NOW(), NOW()),
    ('bbba462e-394b-4cd9-8651-4285a9fd2679', 'individual2@example.com', '$2b$12$uk16RHPh645z8qaLbcHp2.delJt8.kQHhfVYjwoCnMQHngGfHWlim', 'John', 'Doe', 'individual_user', NULL, '{"newsletter": true}', true, false, NOW(), NOW());

-- Create Teacher Profiles
INSERT INTO teacher_profiles (id, user_id, school_id, employee_id, subjects, qualifications, joining_date, department, is_active, is_deleted, created_at, updated_at)
VALUES
    ('3d80f572-5883-479a-9201-05a59a38b7d4', '750d3774-8c9e-49e6-9e8b-d368b383c09b', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', 'T-10001', '["Computer Science", "Programming"]', '{"degrees": ["B.Sc", "M.Ed"], "certifications": ["State Teaching License"]}', '2020-08-01', 'Computer Science', true, false, NOW(), NOW()),
    ('7a8b0558-6659-4959-8a8b-7b6b49f809d9', '98eed427-498b-4b20-8afc-22eff5c045a6', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', 'T-20001', '["Computer Science", "Software Engineering"]', '{"degrees": ["B.A", "M.S"], "certifications": ["State Teaching License"]}', '2019-07-15', 'STEM', true, false, NOW(), NOW());

-- Create Student Profiles
INSERT INTO student_profiles (id, user_id, school_id, enrollment_number, grade_level, section, parent_details, admission_date, academic_status, is_active, is_deleted, created_at, updated_at)
VALUES
    ('7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', 'd2108025-f337-4d51-a168-275c1d490d5d', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', 'S-10001', '10', 'A', '{"name": "John Wilson", "email": "john@example.com", "phone": "123-456-7890"}', '2021-09-01', 'active', true, false, NOW(), NOW()),
    ('c3bb3c98-337b-46c3-bf59-b65d83657a4b', 'a78daaca-b563-4fe0-bdfd-5d0b2edb3b41', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', 'S-10002', '11', 'B', '{"name": "Mary Davis", "email": "mary@example.com", "phone": "234-567-8901"}', '2020-09-01', 'active', true, false, NOW(), NOW()),
    ('ac1f5d4c-47e3-4e4a-bdbf-c9d177b715c8', 'eee7ea06-33ed-4e5b-8230-cd799d18ca8b', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', 'S-20001', '12', 'A', '{"name": "Thomas Miller", "email": "thomas@example.com", "phone": "345-678-9012"}', '2019-09-01', 'active', true, false, NOW(), NOW());

-- Create Courses
INSERT INTO courses (id, created_by_id, title, description, code, status, cover_image_url, settings, difficulty_level, tags, estimated_duration, learning_objectives, target_audience, prerequisites, completion_criteria, grade_level, academic_year, sequence_number, base_price, currency, pricing_type, version, is_d2c_enabled, is_b2b_enabled, is_active, is_deleted, created_at, updated_at)
VALUES
    ('667a6470-766c-4084-bdf6-fbbcdd76737f', '550a8775-1414-4206-ae7d-61625d8e4267', 'Block Based Programming', 'Introduction to programming concepts using visual block-based coding environments like Scratch, Blockly, and App Inventor. Perfect for beginners with no prior coding experience.', 'CS101', 'published', 'https://example.com/covers/block-programming.jpg', '{"requires_review": true}', 'beginner', '["programming", "block-coding", "scratch", "computational-thinking"]', 40, '["Understand fundamental programming concepts", "Create interactive stories and games", "Develop computational thinking skills", "Learn algorithm design through visual programming"]', '["Middle school students", "High school beginners", "Anyone new to programming"]', '["Basic computer skills"]', '{"min_quiz_score": 0.7, "assignments_completed": true}', '6-9', '2023-2024', 1, 79.99, 'USD', 'one-time', '1.0', true, true, true, false, NOW(), NOW()),
    
    ('c2dba75a-8917-412e-88b5-1c7d5d0919a2', '550a8775-1414-4206-ae7d-61625d8e4267', 'Introduction to Python Programming', 'Comprehensive introduction to Python programming language, covering syntax, data structures, control flow, functions, and basic algorithms. Ideal transition from block-based to text-based programming.', 'CS201', 'published', 'https://example.com/covers/python-programming.jpg', '{"requires_review": true}', 'intermediate', '["python", "programming", "coding", "computer-science"]', 60, '["Master Python syntax and semantics", "Implement data structures and algorithms", "Create practical applications", "Develop problem-solving skills through code"]', '["High school students", "College beginners", "Career changers"]', '["Basic understanding of programming concepts", "Block-based coding experience recommended"]', '{"min_quiz_score": 0.7, "assignments_completed": true}', '9-12', '2023-2024', 2, 99.99, 'USD', 'one-time', '1.0', true, true, true, false, NOW(), NOW());

-- Create Course Contents
INSERT INTO course_contents (id, syllabus_url, start_date, end_date, duration_weeks, content_status, resources, is_active, is_deleted, created_at, updated_at)
VALUES
    ('c02dd73e-7323-49fe-85c2-d053f63a2437', 'https://example.com/syllabus/block-programming.pdf', '2023-09-01 00:00:00', '2023-12-15 00:00:00', 16, 'published', '[{"title": "Scratch Quick Reference", "url": "https://example.com/resources/scratch_reference.pdf", "type": "pdf"}, {"title": "Block Programming Glossary", "url": "https://example.com/resources/block_glossary.pdf", "type": "pdf"}]', true, false, NOW(), NOW()),
    
    ('822f2722-551a-4485-b8d2-f2ccd01ea8dd', 'https://example.com/syllabus/python-programming.pdf', '2023-09-01 00:00:00', '2023-12-15 00:00:00', 16, 'published', '[{"title": "Python Cheat Sheet", "url": "https://example.com/resources/python_cheatsheet.pdf", "type": "pdf"}, {"title": "Algorithm Design Guide", "url": "https://example.com/resources/algorithm_guide.pdf", "type": "pdf"}]', true, false, NOW(), NOW());

-- Create Course Versions
INSERT INTO course_versions (id, course_id, version, content_id, valid_from, valid_until, changelog, is_active, is_deleted, created_at, updated_at)
VALUES
    ('74bcb5b1-9e97-46a5-a920-9306ea8bb28e', '667a6470-766c-4084-bdf6-fbbcdd76737f', '1.0', 'c02dd73e-7323-49fe-85c2-d053f63a2437', '2023-09-01 00:00:00', NULL, '{"changes": ["Initial release"]}', true, false, NOW(), NOW()),
    
    ('75d983d0-e58e-4a69-ae7e-3a4ef6c88d03', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', '1.0', '822f2722-551a-4485-b8d2-f2ccd01ea8dd', '2023-09-01 00:00:00', NULL, '{"changes": ["Initial release"]}', true, false, NOW(), NOW());

-- Create Modules for Block Based Programming
INSERT INTO modules (id, content_id, title, description, sequence_number, duration_weeks, status, completion_criteria, is_mandatory, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Block Based Programming modules
    ('36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'c02dd73e-7323-49fe-85c2-d053f63a2437', 'Introduction to Block Programming', 'Foundational concepts of block programming and an introduction to Scratch environment', 1, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('28ca615a-0b03-4d4f-9a66-d4ca2665ffcd', 'c02dd73e-7323-49fe-85c2-d053f63a2437', 'Creating Interactive Stories', 'Learn to create animated stories using characters, backgrounds, and dialogue', 2, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('c52f1912-7805-4d36-82e0-c50467062c39', 'c02dd73e-7323-49fe-85c2-d053f63a2437', 'Game Development Basics', 'Design and implement simple games with scoring, levels, and user interaction', 3, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('23603214-2798-4910-ba7f-adb3056c12fa', 'c02dd73e-7323-49fe-85c2-d053f63a2437', 'Advanced Concepts and Final Project', 'More complex programming concepts and culminating project work', 4, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    -- Python Programming modules
    ('e774235a-c99b-433a-b70d-5828bb153080', '822f2722-551a-4485-b8d2-f2ccd01ea8dd', 'Python Basics', 'Introduction to Python syntax, variables, data types, and simple operations', 1, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('eaf995ec-5c76-41aa-8802-d5596807e038', '822f2722-551a-4485-b8d2-f2ccd01ea8dd', 'Control Flow and Functions', 'Conditionals, loops, function definitions, and parameter handling', 2, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('b6aae9e7-d476-4708-a920-b607c7f9337d', '822f2722-551a-4485-b8d2-f2ccd01ea8dd', 'Data Structures and File Handling', 'Lists, dictionaries, sets, file I/O, and exception handling', 3, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW()),
    
    ('1c35e486-56a2-42e4-8455-a2199358aad7', '822f2722-551a-4485-b8d2-f2ccd01ea8dd', 'Problem Solving and Applications', 'Applied programming projects and algorithmic problem solving', 4, 4, 'published', '{"required_lessons": ["all"]}', true, true, false, NOW(), NOW());

-- Create Lessons for Block Based Programming
INSERT INTO lessons (id, module_id, title, description, sequence_number, content_type, content, duration_minutes, is_mandatory, completion_criteria, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Module 1: Introduction to Block Programming
    ('bb0d95f0-75dd-4873-8c7e-75161259516e', '36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'What is Block Programming?', 'Introduction to visual programming and the concept of blocks as code', 1, 'video', '{"video_url": "https://example.com/videos/block/intro.mp4", "transcript": "In this lesson we introduce block programming as a visual way to create code..."}', 30, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('d9893796-a8d7-4e26-94dd-a1ca20e59ce6', '36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'Getting Started with Scratch', 'Tour of the Scratch interface and creating your first program', 2, 'video', '{"video_url": "https://example.com/videos/block/scratch_interface.mp4", "transcript": "This lesson covers the Scratch environment and how to navigate its components..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('9cf12c11-072a-4b4d-bf4a-5f44e0082896', '36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'Basic Blocks and Motion', 'Using motion blocks to animate sprites on the screen', 3, 'video', '{"video_url": "https://example.com/videos/block/motion_blocks.mp4", "transcript": "In this lesson we learn how to move sprites around the screen using motion blocks..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('d1be7307-83bc-4e7d-af79-c3c1dd7eae7f', '36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'Events and Triggers', 'Understanding event-driven programming with block triggers', 4, 'video', '{"video_url": "https://example.com/videos/block/events_triggers.mp4", "transcript": "This lesson explains how events work in Scratch and how to trigger actions..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 2: Creating Interactive Stories
    ('8caaf7a4-26df-45f4-b994-d5a43cb1c92f', '28ca615a-0b03-4d4f-9a66-d4ca2665ffcd', 'Designing Characters and Backgrounds', 'Creating and customizing sprites and backdrops', 1, 'video', '{"video_url": "https://example.com/videos/block/characters.mp4", "transcript": "In this lesson we learn how to create and modify characters and backgrounds..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('99fbd116-2ba9-417e-82b5-b0ee7c651c8c', '28ca615a-0b03-4d4f-9a66-d4ca2665ffcd', 'Dialogue and Interaction', 'Adding speech, thought bubbles, and user interaction', 2, 'video', '{"video_url": "https://example.com/videos/block/dialogue.mp4", "transcript": "This lesson covers how to create dialogue between characters and interact with users..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('7762838f-8668-456b-a791-a63f6ce8654d', '28ca615a-0b03-4d4f-9a66-d4ca2665ffcd', 'Scene Transitions', 'Creating multiple scenes and transitioning between them', 3, 'video', '{"video_url": "https://example.com/videos/block/scenes.mp4", "transcript": "In this lesson we explore how to create multiple scenes and switch between them..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 3: Game Development Basics
    ('e746f079-bcec-47fa-9a81-c343a226c58e', 'c52f1912-7805-4d36-82e0-c50467062c39', 'Game Mechanics and Rules', 'Designing game rules, scoring systems, and game states', 1, 'video', '{"video_url": "https://example.com/videos/block/game_mechanics.mp4", "transcript": "This lesson introduces fundamental game mechanics and how to implement them..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('0bc1c0d8-1656-481f-8f2b-f3249da8e519', 'c52f1912-7805-4d36-82e0-c50467062c39', 'User Controls and Movement', 'Implementing keyboard and mouse controls for games', 2, 'video', '{"video_url": "https://example.com/videos/block/user_controls.mp4", "transcript": "In this lesson we learn how to handle user input for game control..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('3e3f1309-e7ae-4d38-8b04-ceac1b632fd5', 'c52f1912-7805-4d36-82e0-c50467062c39', 'Collision Detection', 'Detecting when sprites touch each other or boundaries', 3, 'video', '{"video_url": "https://example.com/videos/block/collision.mp4", "transcript": "This lesson covers how to detect and respond to collisions in games..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('8fd60a61-71e1-41ca-a599-7efe2c134315', 'c52f1912-7805-4d36-82e0-c50467062c39', 'Creating a Simple Game', 'Putting it all together to create a complete game', 4, 'video', '{"video_url": "https://example.com/videos/block/simple_game.mp4", "transcript": "In this lesson we build a complete simple game from start to finish..."}', 50, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 4: Advanced Concepts and Final Project
    ('bd90a0db-f203-42a5-b344-e0b3c0790cea', '23603214-2798-4910-ba7f-adb3056c12fa', 'Variables and Data', 'Using variables to store and manipulate data', 1, 'video', '{"video_url": "https://example.com/videos/block/variables.mp4", "transcript": "This lesson introduces variables and how to use them in your programs..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('36e0536c-4ee2-4da5-b4f9-5416bcb0f974', '23603214-2798-4910-ba7f-adb3056c12fa', 'Cloning and Parallel Execution', 'Creating sprite clones and running multiple scripts', 2, 'video', '{"video_url": "https://example.com/videos/block/cloning.mp4", "transcript": "In this lesson we learn about sprite cloning and parallel execution..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('3dccc155-11e7-41d4-9078-9c978e6eca56', '23603214-2798-4910-ba7f-adb3056c12fa', 'Final Project Planning', 'Planning and designing your capstone project', 3, 'video', '{"video_url": "https://example.com/videos/block/project_planning.mp4", "transcript": "This lesson guides you through planning your final project..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('984c53fe-2dfb-475d-a3d4-ebfe22b7adc5', '23603214-2798-4910-ba7f-adb3056c12fa', 'Final Project Implementation', 'Building and refining your capstone project', 4, 'video', '{"video_url": "https://example.com/videos/block/project_implementation.mp4", "transcript": "In this lesson we walk through implementing your final project..."}', 50, true, '{"watch_time": 0.8}', true, false, NOW(), NOW());

-- Create Lessons for Python Programming
INSERT INTO lessons (id, module_id, title, description, sequence_number, content_type, content, duration_minutes, is_mandatory, completion_criteria, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Module 1: Python Basics
    ('4657fd20-2861-46ce-96f7-213e855aca2c', 'e774235a-c99b-433a-b70d-5828bb153080', 'Introduction to Python', 'History of Python, installation, and first program', 1, 'video', '{"video_url": "https://example.com/videos/python/intro.mp4", "transcript": "This lesson introduces Python, its history, and why it is popular..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('7b43fd31-92a7-4c52-a735-1c8bf9a0c6e2', 'e774235a-c99b-433a-b70d-5828bb153080', 'Variables and Data Types', 'Working with integers, floats, strings, and booleans', 2, 'video', '{"video_url": "https://example.com/videos/python/data_types.mp4", "transcript": "In this lesson we explore Python basic data types and how to use variables..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('f9e12a58-03b3-48e1-af89-b2ed32a4e5d6', 'e774235a-c99b-433a-b70d-5828bb153080', 'Basic Operations', 'Arithmetic, comparison, and logical operators', 3, 'video', '{"video_url": "https://example.com/videos/python/operations.mp4", "transcript": "This lesson covers basic operations in Python including arithmetic and comparison..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('d7c5e8b2-17f9-4d19-8f51-9a3bc2e7c8d1', 'e774235a-c99b-433a-b70d-5828bb153080', 'Input and Output', 'Getting user input and displaying output', 4, 'video', '{"video_url": "https://example.com/videos/python/io.mp4", "transcript": "In this lesson we learn how to interact with users through input and output..."}', 35, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 2: Control Flow and Functions
    ('a9c3e85f-6d1b-47e8-b82c-94f8a3e54c7e', 'eaf995ec-5c76-41aa-8802-d5596807e038', 'Conditional Statements', 'Using if, elif, and else for decision making', 1, 'video', '{"video_url": "https://example.com/videos/python/conditionals.mp4", "transcript": "This lesson explains how to make decisions in your code with conditionals..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('b6f1d72e-3a8c-4e59-9b7f-52e8d6c9e1a3', 'eaf995ec-5c76-41aa-8802-d5596807e038', 'Loops', 'For loops and while loops for iteration', 2, 'video', '{"video_url": "https://example.com/videos/python/loops.mp4", "transcript": "In this lesson we learn how to repeat actions with loops..."}', 50, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('e2c7a915-8b4d-4f36-a31e-76c9d3e0c5d8', 'eaf995ec-5c76-41aa-8802-d5596807e038', 'Function Basics', 'Defining and calling functions', 3, 'video', '{"video_url": "https://example.com/videos/python/functions.mp4", "transcript": "This lesson introduces functions as reusable blocks of code..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('f8d2c3b1-5a6e-4e7d-9f8c-1b2a3c4d5e6f', 'eaf995ec-5c76-41aa-8802-d5596807e038', 'Parameters and Return Values', 'Advanced function usage with parameters and returns', 4, 'video', '{"video_url": "https://example.com/videos/python/parameters.mp4", "transcript": "In this lesson we explore function parameters and return values..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 3: Data Structures and File Handling
    ('301b7588-2615-4cdf-93cf-6de261099c88', 'b6aae9e7-d476-4708-a920-b607c7f9337d', 'Lists and Tuples', 'Working with collections of items', 1, 'video', '{"video_url": "https://example.com/videos/python/lists.mp4", "transcript": "This lesson covers Python list and tuple data structures..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('2ea085c9-b094-4f98-aa92-0acb1700887d', 'b6aae9e7-d476-4708-a920-b607c7f9337d', 'Dictionaries and Sets', 'Key-value mappings and unique collections', 2, 'video', '{"video_url": "https://example.com/videos/python/dictionaries.mp4", "transcript": "In this lesson we explore dictionaries and sets in Python..."}', 50, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('8ca689ac-9337-4d03-9430-9709c300cfa1', 'b6aae9e7-d476-4708-a920-b607c7f9337d', 'File Input and Output', 'Reading from and writing to files', 3, 'video', '{"video_url": "https://example.com/videos/python/files.mp4", "transcript": "This lesson teaches how to work with files in Python..."}', 40, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('54617180-2420-4525-bae8-dc8d0b0f1832', 'b6aae9e7-d476-4708-a920-b607c7f9337d', 'Exception Handling', 'Handling errors and exceptions gracefully', 4, 'video', '{"video_url": "https://example.com/videos/python/exceptions.mp4", "transcript": "In this lesson we learn how to handle exceptions in Python..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    -- Module 4: Problem Solving and Applications
    ('9f79227c-0500-4f17-afea-0a0d1a5dbac5', '1c35e486-56a2-42e4-8455-a2199358aad7', 'Algorithmic Thinking', 'Breaking down problems and designing solutions', 1, 'video', '{"video_url": "https://example.com/videos/python/algorithms.mp4", "transcript": "This lesson introduces algorithmic thinking and problem solving..."}', 50, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('99c93969-ffd4-439a-b032-ef800a96901e', '1c35e486-56a2-42e4-8455-a2199358aad7', 'Working with APIs', 'Making HTTP requests and parsing responses', 2, 'video', '{"video_url": "https://example.com/videos/python/apis.mp4", "transcript": "In this lesson we learn how to interact with web APIs..."}', 45, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('da75044f-c53d-4aa4-9802-49f7fe6fd6bf', '1c35e486-56a2-42e4-8455-a2199358aad7', 'Data Analysis Basics', 'Introduction to data processing with Python', 3, 'video', '{"video_url": "https://example.com/videos/python/data_analysis.mp4", "transcript": "This lesson covers basic data analysis techniques in Python..."}', 55, true, '{"watch_time": 0.8}', true, false, NOW(), NOW()),
    
    ('8fb4b4a1-e0ae-4292-a513-27d402a0fb66', '1c35e486-56a2-42e4-8455-a2199358aad7', 'Final Project', 'Building a complete Python application', 4, 'video', '{"video_url": "https://example.com/videos/python/final_project.mp4", "transcript": "In this lesson we build a comprehensive Python application..."}', 60, true, '{"watch_time": 0.8}', true, false, NOW(), NOW());

-- Create Lesson Quizzes
INSERT INTO lesson_quizzes (id, lesson_id, title, description, questions, settings, is_mandatory, passing_score, max_attempts, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Block Programming Quizzes
    ('e05099a6-9e64-466e-a5c1-61fe5438ee81', 'bb0d95f0-75dd-4873-8c7e-75161259516e', 'Block Programming Concepts Quiz', 'Test your understanding of block programming basics', '[
        {"question": "What is block-based programming?", "type": "multiple_choice", "options": ["Writing code with physical blocks", "A visual programming approach using blocks that fit together", "Programming with building blocks", "None of the above"], "correct_answer": 1},
        {"question": "Which of the following is a block-based programming environment?", "type": "multiple_choice", "options": ["Python", "Scratch", "Java", "C++"], "correct_answer": 1}
    ]', '{"time_limit": 10, "randomize_questions": true}', true, 0.7, 3, true, false, NOW(), NOW()),
    
    ('4d0d7e74-758d-4252-b5dc-a27b97be844c', 'e746f079-bcec-47fa-9a81-c343a226c58e', 'Game Mechanics Quiz', 'Test your knowledge of game design concepts', '[
        {"question": "What is a game mechanic?", "type": "multiple_choice", "options": ["The hardware a game runs on", "Rules and methods designed for interaction with the game state", "Graphics in a game", "The storyline of a game"], "correct_answer": 1},
        {"question": "What is a scoring system used for in games?", "type": "multiple_choice", "options": ["To track player progress", "To make the game more complex", "To add colors to the game", "To create characters"], "correct_answer": 0}
    ]', '{"time_limit": 10, "randomize_questions": true}', true, 0.7, 3, true, false, NOW(), NOW()),
    
    -- Python Programming Quizzes
    ('2c751efa-e8f7-4a50-8bd3-1cfc2db6620e', '4657fd20-2861-46ce-96f7-213e855aca2c', 'Python Basics Quiz', 'Test your knowledge of Python fundamentals', '[
        {"question": "What type of language is Python?", "type": "multiple_choice", "options": ["Compiled language", "Assembly language", "Machine language", "Interpreted language"], "correct_answer": 3},
        {"question": "Which symbol is used for comments in Python?", "type": "multiple_choice", "options": ["//", "/* */", "#", "<!-- -->"], "correct_answer": 2}
    ]', '{"time_limit": 10, "randomize_questions": true}', true, 0.7, 3, true, false, NOW(), NOW()),
    
    ('c31331ad-9016-4085-9c3b-7d73ac02ae4d', 'a9c3e85f-6d1b-47e8-b82c-94f8a3e54c7e', 'Control Flow Quiz', 'Test your understanding of conditional statements', '[
        {"question": "What does the if statement do in Python?", "type": "multiple_choice", "options": ["Repeats code multiple times", "Defines a function", "Executes code conditionally based on a Boolean expression", "Imports a module"], "correct_answer": 2},
        {"question": "What keyword is used to handle the situation when no if or elif conditions are true?", "type": "multiple_choice", "options": ["otherwise", "default", "else", "finally"], "correct_answer": 2}
    ]', '{"time_limit": 10, "randomize_questions": true}', true, 0.7, 3, true, false, NOW(), NOW());

-- Create Course Licenses
INSERT INTO course_licenses (id, course_id, school_id, granted_by_id, valid_from, valid_until, max_students, is_active, is_deleted, created_at, updated_at)
VALUES
    ('9b269bc3-ba52-4202-998a-062e7444b08a', '667a6470-766c-4084-bdf6-fbbcdd76737f', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '26f9c519-c5ce-4cd1-a88a-2cd8ecb7f48d', '2023-09-01 00:00:00', '2024-09-01 00:00:00', 200, true, false, NOW(), NOW()),
    
    ('9dd9855e-1c47-4a8e-b54c-5c9eaaf172fa', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', 'f302ee95-4d06-4b87-8d3e-916aefd0cd01', '26f9c519-c5ce-4cd1-a88a-2cd8ecb7f48d', '2023-09-01 00:00:00', '2024-09-01 00:00:00', 200, true, false, NOW(), NOW()),
    
    ('98ac1b6f-e7a9-4423-b14d-424bad677cca', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', '2d8d37c9-27a4-4e09-bd19-75d1a8e8753e', 'ac11adc5-f868-41c1-bea4-f67c89db97df', '2023-09-01 00:00:00', '2024-09-01 00:00:00', 150, true, false, NOW(), NOW());

-- Create Course Enrollments (B2B and D2C)
INSERT INTO course_enrollments (id, course_id, version_id, student_id, individual_user_id, enrolled_by_id, enrollment_type, status, enrolled_at, progress, last_activity_at, is_active, is_deleted, created_at, updated_at)
VALUES
    -- B2B enrollments
    ('46e8433a-02d2-4635-9430-43b1f0d56da9', '667a6470-766c-4084-bdf6-fbbcdd76737f', '74bcb5b1-9e97-46a5-a920-9306ea8bb28e', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, '750d3774-8c9e-49e6-9e8b-d368b383c09b', 'b2b', 'enrolled', '2023-09-05 00:00:00', 0.25, '2023-10-01 15:30:00', true, false, NOW(), NOW()),
    
    ('f3cbac89-a82e-4a98-8397-887a105b1697', '667a6470-766c-4084-bdf6-fbbcdd76737f', '74bcb5b1-9e97-46a5-a920-9306ea8bb28e', 'c3bb3c98-337b-46c3-bf59-b65d83657a4b', NULL, '750d3774-8c9e-49e6-9e8b-d368b383c09b', 'b2b', 'enrolled', '2023-09-05 00:00:00', 0.15, '2023-09-28 14:45:00', true, false, NOW(), NOW()),
    
    ('8979b356-2089-470b-b529-1d9540a5e064', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', '75d983d0-e58e-4a69-ae7e-3a4ef6c88d03', 'ac1f5d4c-47e3-4e4a-bdbf-c9d177b715c8', NULL, '98eed427-498b-4b20-8afc-22eff5c045a6', 'b2b', 'enrolled', '2023-09-06 00:00:00', 0.10, '2023-09-25 11:20:00', true, false, NOW(), NOW()),
    
    -- D2C enrollment (individual user)
    ('03fb19cc-1125-4497-905d-acb949c46357', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', '75d983d0-e58e-4a69-ae7e-3a4ef6c88d03', NULL, '3b280a98-06b0-45d8-8cc7-8d589d47ba32', '550a8775-1414-4206-ae7d-61625d8e4267', 'd2c', 'enrolled', '2023-09-10 00:00:00', 0.05, '2023-09-15 16:00:00', true, false, NOW(), NOW());

-- Create User Progress
INSERT INTO user_progress (id, enrollment_id, content_type, content_id, status, progress, started_at, last_interaction, time_spent_seconds, progress_metadata, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Block Programming Course Progress
    ('8901dd63-6b15-41d8-8048-ee995a30dedd', '46e8433a-02d2-4635-9430-43b1f0d56da9', 'course', '667a6470-766c-4084-bdf6-fbbcdd76737f', 'in_progress', 0.25, '2023-09-05 10:00:00', '2023-10-01 15:30:00', 3600, '{"completed_modules": 1, "total_modules": 4}', true, false, NOW(), NOW()),
    
    -- Block Programming Module Progress
    ('49cd3c26-dbfa-42b1-89fc-82520bd6d1be', '46e8433a-02d2-4635-9430-43b1f0d56da9', 'module', '36ff20d3-b87b-4b8e-8fb7-7c9e1d461dea', 'completed', 1.0, '2023-09-05 10:00:00', '2023-09-20 14:30:00', 1800, '{"completed_lessons": 4, "total_lessons": 4}', true, false, NOW(), NOW()),
    
    ('6839424f-1e0c-47b1-87ee-eed809865b94', '46e8433a-02d2-4635-9430-43b1f0d56da9', 'module', '28ca615a-0b03-4d4f-9a66-d4ca2665ffcd', 'in_progress', 0.33, '2023-09-21 09:15:00', '2023-10-01 15:30:00', 900, '{"completed_lessons": 1, "total_lessons": 3}', true, false, NOW(), NOW()),
    
    -- Python Course Progress
    ('c0e41077-e961-4b22-ab95-3e36cfa8381b', '8979b356-2089-470b-b529-1d9540a5e064', 'course', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', 'in_progress', 0.10, '2023-09-06 11:00:00', '2023-09-25 11:20:00', 1200, '{"completed_modules": 0, "total_modules": 4}', true, false, NOW(), NOW()),
    
    -- Python Module Progress
    ('bb6e289c-b57c-4050-9256-07378333ee2a', '8979b356-2089-470b-b529-1d9540a5e064', 'module', 'e774235a-c99b-433a-b70d-5828bb153080', 'in_progress', 0.50, '2023-09-06 11:00:00', '2023-09-25 11:20:00', 1200, '{"completed_lessons": 2, "total_lessons": 4}', true, false, NOW(), NOW());

INSERT INTO user_progress (id, enrollment_id, content_type, content_id, status, progress, started_at, last_interaction, time_spent_seconds, progress_metadata, is_active, is_deleted, created_at, updated_at)
VALUES
    ('25ba2157-e6d9-41aa-a175-84d0b0e4c03c', '03fb19cc-1125-4497-905d-acb949c46357', 'course', '667a6470-766c-4084-bdf6-fbbcdd76737f', 'in_progress', 0.50, '2023-09-05 10:00:00', '2023-10-01 15:30:00', 7200, '{"completed_modules": 2, "total_modules": 4}', true, false, NOW(), NOW()),

-- Create Lesson Progress
INSERT INTO lesson_progress (id, lesson_id, student_id, individual_user_id, status, progress, started_at, last_interaction, time_spent_seconds, is_active, is_deleted, created_at, updated_at)
VALUES
    -- Block Programming Lesson Progress for Student
    ('d9e917f9-a96a-4e0f-be65-650d0873c827', 'bb0d95f0-75dd-4873-8c7e-75161259516e', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, 'completed', 1.0, '2023-09-05 10:00:00', '2023-09-05 10:35:00', 2100, true, false, NOW(), NOW()),
    
    ('a0802aca-2120-4113-ae07-af024796d7a1', 'd9893796-a8d7-4e26-94dd-a1ca20e59ce6', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, 'completed', 1.0, '2023-09-06 14:00:00', '2023-09-06 14:40:00', 2400, true, false, NOW(), NOW()),
    
    ('dc9727ab-dee7-4e73-a144-020ddc3a1d29', '9cf12c11-072a-4b4d-bf4a-5f44e0082896', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, 'completed', 1.0, '2023-09-10 11:30:00', '2023-09-10 12:15:00', 2700, true, false, NOW(), NOW()),
    
    ('99604cef-1894-4360-85fc-4881d1235e1b', 'd1be7307-83bc-4e7d-af79-c3c1dd7eae7f', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, 'completed', 1.0, '2023-09-15 09:45:00', '2023-09-15 10:25:00', 2400, true, false, NOW(), NOW()),
    
    ('ff9d6d7d-4d24-4504-8d4d-0197b12fb26f', '8caaf7a4-26df-45f4-b994-d5a43cb1c92f', '7c411e2c-2a15-4c2a-896b-ce4fd38d9a29', NULL, 'completed', 1.0, '2023-09-20 13:15:00', '2023-09-20 14:00:00', 2700, true, false, NOW(), NOW()),
    
    -- Python Lesson Progress for Individual User
    ('99e23104-8c6a-4839-9bd1-6b749b6dbe68', '4657fd20-2861-46ce-96f7-213e855aca2c', NULL, '3b280a98-06b0-45d8-8cc7-8d589d47ba32', 'completed', 1.0, '2023-09-10 16:00:00', '2023-09-10 16:45:00', 2700, true, false, NOW(), NOW()),
    
    ('6fa71c2d-0690-4699-941a-418c23b68cec', '7b43fd31-92a7-4c52-a735-1c8bf9a0c6e2', NULL, '3b280a98-06b0-45d8-8cc7-8d589d47ba32', 'in_progress', 0.6, '2023-09-15 17:30:00', '2023-09-15 18:00:00', 1800, true, false, NOW(), NOW());

-- Create Course Reviews
INSERT INTO course_reviews (id, enrollment_id, rating, review_text, pros, cons, would_recommend, difficulty_rating, engagement_rating, is_featured, status, is_active, is_deleted, created_at, updated_at)
VALUES
    ('37bde92d-fbe5-479c-8d6c-3b659830cf62', '46e8433a-02d2-4635-9430-43b1f0d56da9', 5, 'Excellent introduction to programming concepts! The visual approach made it easy to understand.', '["Easy to follow", "Fun projects", "Great visuals"]', '["Would like more advanced topics"]', true, 2, 5, true, 'approved', true, false, NOW(), NOW()),
    
    ('60844a34-8a8f-4e72-bc69-c7da353fc69b', '03fb19cc-1125-4497-905d-acb949c46357', 4, 'Python course is well-structured and informative. Some parts could use more examples.', '["Comprehensive", "Practical examples", "Good pacing"]', '["More practice exercises needed", "Some concepts explained too quickly"]', true, 3, 4, false, 'approved', true, false, NOW(), NOW());

-- Create Course Purchases (for individual users)
INSERT INTO course_purchases (id, course_id, user_id, amount_paid, currency, payment_method, payment_status, purchase_date, valid_until, is_active, is_deleted, created_at, updated_at)
VALUES
    ('517af3c7-0e05-4f85-a6d0-ff318a3e5d46', 'c2dba75a-8917-412e-88b5-1c7d5d0919a2', '3b280a98-06b0-45d8-8cc7-8d589d47ba32', 99.99, 'USD', '{"type": "credit_card", "last4": "4242"}', 'completed', '2023-09-10 00:00:00', '2024-09-10 00:00:00', true, false, NOW(), NOW());