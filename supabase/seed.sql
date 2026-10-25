-- ====================================================================
-- HostelEase: Deterministic Seed Data for PostgreSQL
-- ====================================================================

-- Seed Rooms
INSERT INTO public.rooms (id, building, floor, room_number, capacity, room_type, is_active, notes)
VALUES
('00000000-0000-0000-0000-000000000001', 'Wing A', 1, 'A-101', 2, 'Double', true, 'South wing, natural lighting, attached study lamps.'),
('00000000-0000-0000-0000-000000000002', 'Wing A', 1, 'A-102', 2, 'Double', true, 'Double occupancy, renovated wardrobes.'),
('00000000-0000-0000-0000-000000000003', 'Wing A', 1, 'A-103', 2, 'Double', true, 'Bed-2 available.'),
('00000000-0000-0000-0000-000000000004', 'Wing A', 1, 'A-104', 1, 'Single', true, 'Single research scholar room.'),
('00000000-0000-0000-0000-000000000005', 'Wing B', 2, 'B-201', 2, 'Double', true, 'North wing, quiet study zone.'),
('00000000-0000-0000-0000-000000000006', 'Wing B', 2, 'B-202', 3, 'Triple', true, 'Triple room with balcony.'),
('00000000-0000-0000-0000-000000000007', 'Wing B', 2, 'B-203', 4, 'Four Sharing', true, 'Four-bed dorm with individual lockers.')
ON CONFLICT (room_number) DO NOTHING;

-- Seed Mess Menus
INSERT INTO public.mess_menus (day_of_week, breakfast, lunch, snacks, dinner, special_item, published_by)
VALUES
('Monday', 'Idli, Medu Vada, Sambar, Coconut Chutney', 'Steamed Rice, Dal Tadka, Aloo Gobhi, Phulka, Curd', 'Samosa, Mint Chutney, Hot Chai', 'Jeera Rice, Paneer Butter Masala, Roti, Gulab Jamun', 'Gulab Jamun (1 pc)', 'Mess Committee'),
('Tuesday', 'Poha, Sev, Banana, Tea/Coffee', 'Lemon Rice, Rajma Masala, Steamed Rice, Chapati', 'Veg Cutlet, Tomato Sauce, Tea', 'Veg Pulao, Dal Makhani, Tandoori Roti, Kheer', NULL, 'Mess Committee'),
('Wednesday', 'Masala Dosa, Sambar, Chutney', 'Rice, Sambar, Rasam, Bhindi Masala, Curd', 'Biscuits, Bun Maska, Tea', 'Egg Curry / Paneer Do Pyaza, Phulka, Fruit Salad', 'Egg Curry or Paneer Option', 'Mess Committee'),
('Thursday', 'Aloo Paratha, Curd, Pickle, Fruits', 'Veg Biryani, Mirchi Ka Salan, Onion Raita', 'Pani Puri / Bhel Puri counters', 'Dal Tadka, Mix Veg Kadai, Phulka, Moong Dal Halwa', NULL, 'Mess Committee'),
('Friday', 'Upma with Chutney, Kesari Bath', 'Chole Bhature / Rice & Chole, Boondi Raita', 'Pav Bhaji, Lemon slices, Chai', 'Chicken Curry / Shahi Paneer, Jeera Rice, Ice Cream', 'Special Friday Feast + Vanilla Ice Cream', 'Mess Committee'),
('Saturday', 'Uttapam, Sambar, Tomato Chutney', 'Curd Rice, Tamarind Rice, Sambar, Papad', 'Corn Chaat, Green Tea / Chai', 'Khichdi, Kadhi, Papad, Aloo Jeera, Fruit Custard', NULL, 'Mess Committee'),
('Sunday', 'Puri Bhaji, Halwa, Fresh Milk', 'Hyderabadi Dum Biryani (Veg/Non-Veg), Raita', 'Tea & Assorted Cookies', 'Light Dinner: Chapati, Dal Palak, Buttermilk', 'Sunday Special Dum Biryani', 'Mess Committee')
ON CONFLICT (day_of_week) DO NOTHING;

-- Seed Notices
INSERT INTO public.notices (title, body, category, target_audience, created_by, is_emergency)
VALUES
('Hostel Gate Closing Hours & Night Curfew Policy', 'All residents are advised that main hostel gates will strictly lock at 10:00 PM on weekdays and 10:30 PM on weekends.', 'General', 'All Residents', 'Chief Warden', false),
('Water Supply Shutdown for Tank Descaling on Oct 27', 'Wing A overhead water tanks will undergo chemical disinfection on Sunday 27 October from 1:00 PM to 5:00 PM. Please store adequate water.', 'Maintenance', 'Wing A', 'Estate Office', true),
('Odd Semester Hostel Fee Clearance Deadline: 15 Nov', 'Residents with pending fee dues are requested to clear balances before 15 November 2026 to avoid late surcharges.', 'Fees', 'Students', 'Finance Office', false);
