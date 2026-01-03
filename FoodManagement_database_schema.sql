CREATE DATABASE FoodManagementDB;
GO

USE FoodManagementDB;
GO
CREATE TABLE [User] (
    user_id INT IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);
CREATE TABLE Role (
    role_id INT IDENTITY PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE UserRole (
    user_role_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,

    CONSTRAINT FK_UserRole_User FOREIGN KEY (user_id)
        REFERENCES [User](user_id),

    CONSTRAINT FK_UserRole_Role FOREIGN KEY (role_id)
        REFERENCES Role(role_id),

    CONSTRAINT UQ_UserRole UNIQUE (user_id, role_id)
);
CREATE TABLE Category (
    category_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);
CREATE TABLE FoodItem (
    food_item_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME
);
CREATE TABLE FoodItemCategory (
    fic_id INT IDENTITY PRIMARY KEY,
    food_item_id INT NOT NULL,
    category_id INT NOT NULL,

    CONSTRAINT FK_FIC_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT FK_FIC_Category FOREIGN KEY (category_id)
        REFERENCES Category(category_id),

    CONSTRAINT UQ_FoodItemCategory UNIQUE (food_item_id, category_id)
);
CREATE TABLE Ingredient (
    ingredient_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255)
);
CREATE TABLE FoodItemIngredient (
    fii_id INT IDENTITY PRIMARY KEY,
    food_item_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity_required DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_FII_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT FK_FII_Ingredient FOREIGN KEY (ingredient_id)
        REFERENCES Ingredient(ingredient_id),

    CONSTRAINT UQ_FoodItemIngredient UNIQUE (food_item_id, ingredient_id)
);
CREATE TABLE Supplier (
    supplier_id INT IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20)
);
CREATE TABLE Purchase (
    purchase_id INT IDENTITY PRIMARY KEY,
    supplier_id INT NOT NULL,
    purchase_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Purchase_Supplier FOREIGN KEY (supplier_id)
        REFERENCES Supplier(supplier_id)
);
CREATE TABLE PurchaseItem (
    purchase_item_id INT IDENTITY PRIMARY KEY,
    purchase_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_PI_Purchase FOREIGN KEY (purchase_id)
        REFERENCES Purchase(purchase_id),

    CONSTRAINT FK_PI_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT UQ_PurchaseItem UNIQUE (purchase_id, food_item_id)
);
CREATE TABLE Stock (
    stock_id INT IDENTITY PRIMARY KEY,
    food_item_id INT UNIQUE NOT NULL,
    quantity_available DECIMAL(10,2) NOT NULL,
    last_updated DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Stock_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id)
);
CREATE TABLE [Order] (
    order_id INT IDENTITY PRIMARY KEY,
    order_date DATETIME DEFAULT GETDATE(),
    order_type VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL
);
CREATE TABLE OrderItem (
    order_item_id INT IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_OI_Order FOREIGN KEY (order_id)
        REFERENCES [Order](order_id),

    CONSTRAINT FK_OI_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT UQ_OrderItem UNIQUE (order_id, food_item_id)
);
CREATE TABLE Payment (
    payment_id INT IDENTITY PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE()
);
CREATE TABLE OrderPayment (
    order_payment_id INT IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    payment_id INT NOT NULL,

    CONSTRAINT FK_OP_Order FOREIGN KEY (order_id)
        REFERENCES [Order](order_id),

    CONSTRAINT FK_OP_Payment FOREIGN KEY (payment_id)
        REFERENCES Payment(payment_id)
);
CREATE TABLE InventoryLog (
    log_id INT IDENTITY PRIMARY KEY,
    food_item_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    quantity_change DECIMAL(10,2) NOT NULL,
    timestamp DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Log_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT FK_Log_User FOREIGN KEY (user_id)
        REFERENCES [User](user_id)
);
CREATE TABLE Unit (
    unit_id INT IDENTITY PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL,
    conversion_rate DECIMAL(10,4) NULL
);
CREATE TABLE ItemUnit (
    item_unit_id INT IDENTITY PRIMARY KEY,
    food_item_id INT NOT NULL,
    unit_id INT NOT NULL,
    is_default BIT DEFAULT 0,

    CONSTRAINT FK_IU_FoodItem FOREIGN KEY (food_item_id)
        REFERENCES FoodItem(food_item_id),

    CONSTRAINT FK_IU_Unit FOREIGN KEY (unit_id)
        REFERENCES Unit(unit_id),

    CONSTRAINT UQ_ItemUnit UNIQUE (food_item_id, unit_id)
);
SET IDENTITY_INSERT [Role] ON;
INSERT INTO [Role] (role_id, role_name) VALUES
(1, 'Admin'),
(2, 'Manager'),
(3, 'Chef'),
(4, 'Kitchen Staff'),
(5, 'Waiter'),
(6, 'Cashier'),
(7, 'Delivery Driver'),
(8, 'Inventory Control'),
(9, 'Supplier Relations'),
(10, 'Marketing');
SET IDENTITY_INSERT [Role] OFF;
SET IDENTITY_INSERT [Unit] ON;
INSERT INTO [Unit] (unit_id, unit_name, conversion_rate) VALUES
(1, 'kg', 1.0000),
(2, 'gram', 0.0010),
(3, 'liter', 1.0000),
(4, 'ml', 0.0010),
(5, 'piece', NULL),
(6, 'dozen', 12.0000),
(7, 'pack', NULL),
(8, 'box', NULL),
(9, 'lb', 0.4536),
(10, 'cup', 0.2366);
SET IDENTITY_INSERT [Unit] OFF;
SET IDENTITY_INSERT Supplier ON;
INSERT INTO Supplier (supplier_id, name, contact, phone) VALUES
(1, 'Dairy King Distributors', 'Mr. Patel', '555-1001'),
(2, 'Fresh Veggie Market', 'Ms. Lin', '555-1002'),
(3, 'Prime Meats Corp', 'Mr. Sanchez', '555-1003'),
(4, 'Global Spice Traders', 'Ms. Kaur', '555-1004'),
(5, 'Beverage Systems Inc', 'Mr. Jones', '555-1005'),
(6, 'Bakery Flour Mill', 'Ms. Chen', '555-1006'),
(7, 'Oil & Fat Supply', 'Mr. Smith', '555-1007'),
(8, 'Seafood Express', 'Ms. Williams', '555-1008'),
(9, 'Produce Wholesale', 'Mr. Davis', '555-1009'),
(10, 'Grains & Pasta Co', 'Ms. Taylor', '555-1010'),
(11, 'Organic Foods Source', 'Mr. Brown', '555-1011'),
(12, 'Local Farm Eggs', 'Ms. Garcia', '555-1012'),
(13, 'Frozen Goods Depot', 'Mr. Wilson', '555-1013'),
(14, 'Cleaning Supplies Co', 'Ms. Lee', '555-1014'),
(15, 'Paper & Packaging', 'Mr. Hernandez', '555-1015'),
(16, 'Specialty Cheese', 'Ms. King', '555-1016'),
(17, 'Premium Coffee Beans', 'Mr. Carter', '555-1017'),
(18, 'Wine & Spirits', 'Ms. Rodriguez', '555-1018'),
(19, 'Asian Imports', 'Mr. Nguyen', '555-1019'),
(20, 'Seasonal Fruit', 'Ms. Miller', '555-1020');
SET IDENTITY_INSERT Supplier OFF;
SET IDENTITY_INSERT Category ON;
INSERT INTO Category (category_id, name, description) VALUES
(1, 'Appetizers', 'Small bites to start the meal.'),
(2, 'Main Dishes', 'The primary course of the meal.'),
(3, 'Desserts', 'Sweet items after the meal.'),
(4, 'Beverages (Hot)', 'Hot drinks like coffee and tea.'),
(5, 'Beverages (Cold)', 'Cold drinks and juices.'),
(6, 'Salads', 'Fresh and healthy leafy dishes.'),
(7, 'Sandwiches & Wraps', 'Lunch time staples.'),
(8, 'Soups', 'Warm, liquid dishes.'),
(9, 'Kids Menu', 'Smaller portions for children.'),
(10, 'Pastas', 'Italian noodle dishes.'),
(11, 'Seafood', 'Dishes featuring fish and shellfish.'),
(12, 'Vegetarian', 'Dishes without meat.'),
(13, 'Gluten-Free', 'Dishes suitable for gluten intolerance.'),
(14, 'Spicy', 'Dishes with significant heat.'),
(15, 'Chef Specials', 'Unique, rotating seasonal items.'),
(16, 'Sides', 'Accompaniments to main dishes.'),
(17, 'Breakfast', 'Items served primarily in the morning.'),
(18, 'Pizzas', 'Classic Italian flatbreads.'),
(19, 'Chicken Dishes', 'Main courses featuring chicken.'),
(20, 'Beef Dishes', 'Main courses featuring beef.');
SET IDENTITY_INSERT Category OFF;
SET IDENTITY_INSERT Ingredient ON;
INSERT INTO Ingredient (ingredient_id, name, description) VALUES
(1, 'All-Purpose Flour', 'Base for breads and pastas.'),
(2, 'Salt', 'Basic seasoning.'),
(3, 'Sugar', 'Sweetener.'),
(4, 'Yeast', 'Leavening agent for bread.'),
(5, 'Fresh Chicken Breast', 'Protein for main dishes.'),
(6, 'Ground Beef', 'Meat for burgers and sauces.'),
(7, 'Roma Tomatoes', 'Base for sauces and salads.'),
(8, 'Onion (Yellow)', 'Basic aromatic vegetable.'),
(9, 'Garlic', 'Flavoring agent.'),
(10, 'Olive Oil (Extra Virgin)', 'Cooking and finishing oil.'),
(11, 'Mozzarella Cheese', 'Key cheese for many dishes.'),
(12, 'Parmesan Cheese', 'Hard Italian cheese.'),
(13, 'Butter', 'Dairy fat for cooking.'),
(14, 'Eggs (Large)', 'Binding agent and breakfast item.'),
(15, 'Milk (Whole)', 'Dairy for beverages and sauces.'),
(16, 'Lettuce (Romaine)', 'Base for salads.'),
(17, 'Bell Peppers (Red)', 'Sweet vegetable.'),
(18, 'Mushrooms (Crimini)', 'Earthy vegetable.'),
(19, 'Black Olives (Sliced)', 'Pizza topping and salad addition.'),
(20, 'Dried Oregano', 'Herb.'),
(21, 'Fresh Basil', 'Aromatic herb.'),
(22, 'Potatoes (Russet)', 'Starchy vegetable.'),
(23, 'Bacon (Smoked)', 'Cured meat.'),
(24, 'Shrimp (Peeled)', 'Seafood.'),
(25, 'Lemon Juice (Fresh)', 'Acidic flavor.'),
(26, 'Heavy Cream', 'For sauces and desserts.'),
(27, 'Vanilla Extract', 'Flavoring for desserts.'),
(28, 'Coffee Beans (Ground)', 'For hot beverages.'),
(29, 'Black Tea Bags', 'For hot beverages.'),
(30, 'Cabbage (Shredded)', 'For slaws and wraps.'),
(31, 'Cheddar Cheese', 'Sharp cheese.'),
(32, 'Mayonnaise', 'Condiment/base.'),
(33, 'Chili Flakes', 'Spicy seasoning.'),
(34, 'Avocado', 'Creamy fruit.'),
(35, 'Cilantro (Fresh)', 'Herb.'),
(36, 'Rice (Basmati)', 'Grain.'),
(37, 'Soy Sauce', 'Umami seasoning.'),
(38, 'Brown Sugar', 'Dark sweetener.'),
(39, 'Carrots (Shredded)', 'Vegetable.'),
(40, 'Wine Vinegar (Red)', 'Acidic condiment.');
SET IDENTITY_INSERT Ingredient OFF;
SET IDENTITY_INSERT FoodItem ON;
INSERT INTO FoodItem (food_item_id, name, description, price, created_at, updated_at) VALUES
(101, 'Classic Cheeseburger', '1/3lb beef patty with cheddar, lettuce, tomato.', 12.99, GETDATE(), NULL),
(102, 'Margherita Pizza', 'Tomato sauce, fresh mozzarella, and basil.', 15.50, GETDATE(), NULL),
(103, 'Chicken Caesar Salad', 'Grilled chicken, romaine, parmesan, croutons.', 10.99, GETDATE(), NULL),
(104, 'Spicy Arrabbiata Pasta', 'Penne pasta in a fiery tomato sauce.', 14.75, GETDATE(), NULL),
(105, 'Garlic Knots (6pc)', 'Oven-baked knots with garlic butter.', 5.00, GETDATE(), NULL),
(106, 'Chocolate Lava Cake', 'Warm cake with a molten chocolate center.', 8.50, GETDATE(), NULL),
(107, 'Iced Tea (Unsweet)', 'Freshly brewed unsweetened black tea.', 3.00, GETDATE(), NULL),
(108, 'Espresso Shot', 'Single shot of rich espresso.', 2.50, GETDATE(), NULL),
(109, 'Veggie Burger', 'Black bean patty with avocado and sprouts.', 11.50, GETDATE(), NULL),
(110, 'Shrimp Scampi', 'Shrimp sautéed in garlic butter over linguine.', 19.99, GETDATE(), NULL),
(111, 'French Fries', 'Crispy, classic potato fries.', 4.50, GETDATE(), NULL),
(112, 'New York Cheesecake', 'Classic cream cheese filling with graham crust.', 7.99, GETDATE(), NULL),
(113, 'Chicken Wrap', 'Grilled chicken, lettuce, tomato, ranch in a wrap.', 9.50, GETDATE(), NULL),
(114, 'Tomato Basil Soup', 'Creamy soup with fresh tomato and basil.', 6.00, GETDATE(), NULL),
(115, 'Kids Mac & Cheese', 'Elbow pasta with cheesy sauce.', 7.00, GETDATE(), NULL),
(116, 'BBQ Chicken Pizza', 'BBQ sauce base, chicken, red onion.', 16.50, GETDATE(), NULL),
(117, 'Steak Frites', 'Grilled sirloin steak with French fries.', 24.99, GETDATE(), NULL),
(118, 'Salmon Fillet', 'Baked salmon with lemon-dill sauce.', 22.00, GETDATE(), NULL),
(119, 'Side Salad', 'Mixed greens, cucumber, tomato.', 5.50, GETDATE(), NULL),
(120, 'Diet Soda', 'Assorted low-calorie soft drinks.', 3.00, GETDATE(), NULL),
(121, 'Mocha Latte', 'Espresso, milk, chocolate, served hot.', 5.50, GETDATE(), NULL),
(122, 'Tuna Melt Sandwich', 'Tuna salad, Swiss cheese, grilled on rye.', 10.00, GETDATE(), NULL),
(123, 'Chocolate Chip Cookie', 'Large, freshly baked cookie.', 3.50, GETDATE(), NULL),
(124, 'Buffalo Wings (6pc)', 'Spicy chicken wings with blue cheese dip.', 8.99, GETDATE(), NULL),
(125, 'Veggie Delight Pizza', 'Mushrooms, olives, peppers, onions.', 17.00, GETDATE(), NULL),
(126, 'Caesar Wrap', 'Romaine lettuce, parmesan, dressing in a wrap.', 8.50, GETDATE(), NULL),
(127, 'Water Bottle', 'Bottled still water.', 2.00, GETDATE(), NULL),
(128, 'Pork Ribs', 'Slow-cooked BBQ pork ribs.', 26.00, GETDATE(), NULL),
(129, 'Mashed Potatoes', 'Creamy mashed potatoes.', 5.00, GETDATE(), NULL),
(130, 'Tiramisu', 'Classic Italian coffee-flavored dessert.', 9.00, GETDATE(), NULL),
(131, 'Fettuccine Alfredo', 'Fettuccine in a rich cream sauce.', 15.00, GETDATE(), NULL),
(132, 'Caprese Salad', 'Fresh mozzarella, tomato, basil, balsamic glaze.', 11.99, GETDATE(), NULL),
(133, 'Loaded Nachos', 'Tortilla chips, cheese, jalapeños, sour cream.', 13.50, GETDATE(), NULL),
(134, 'Apple Juice (Kids)', 'Small carton of apple juice.', 2.50, GETDATE(), NULL),
(135, 'Hot Cocoa', 'Warm chocolate drink.', 4.00, GETDATE(), NULL),
(136, 'Turkey Club Sandwich', 'Turkey, bacon, lettuce, tomato on toast.', 11.99, GETDATE(), NULL),
(137, 'Side of Broccoli', 'Steamed broccoli.', 4.00, GETDATE(), NULL),
(138, 'Spaghetti Bolognese', 'Spaghetti with hearty meat sauce.', 16.50, GETDATE(), NULL),
(139, 'Calamari Fritti', 'Fried calamari with marinara sauce.', 14.00, GETDATE(), NULL),
(140, 'Flourless Chocolate Cake', 'Rich, dense chocolate cake (Gluten-Free).', 9.50, GETDATE(), NULL);
SET IDENTITY_INSERT FoodItem OFF;
SET IDENTITY_INSERT FoodItemCategory ON;
INSERT INTO FoodItemCategory (fic_id, food_item_id, category_id) VALUES
(1, 101, 2), (2, 101, 20), (3, 102, 18), (4, 102, 12), (5, 103, 6), (6, 103, 19), 
(7, 104, 10), (8, 104, 14), (9, 105, 16), (10, 106, 3), (11, 107, 5), (12, 108, 4), 
(13, 109, 7), (14, 109, 12), (15, 110, 10), (16, 110, 11), (17, 111, 16), (18, 112, 3), 
(19, 113, 7), (20, 113, 19), (21, 114, 8), (22, 114, 12), (23, 115, 9), (24, 116, 18), 
(25, 116, 19), (26, 117, 2), (27, 117, 20), (28, 118, 2), (29, 118, 11), (30, 119, 6), 
(31, 120, 5), (32, 121, 4), (33, 122, 7), (34, 123, 3), (35, 124, 1), (36, 124, 19), 
(37, 125, 18), (38, 125, 12), (39, 126, 7), (40, 127, 5), (41, 128, 2), (42, 129, 16), 
(43, 130, 3), (44, 131, 10), (45, 132, 6), (46, 132, 12), (47, 133, 1), (48, 134, 9), 
(49, 134, 5), (50, 135, 4), (51, 136, 7), (52, 136, 19), (53, 137, 16), (54, 137, 12), 
(55, 138, 10), (56, 138, 20), (57, 139, 1), (58, 139, 11), (59, 140, 3), (60, 140, 13);
SET IDENTITY_INSERT FoodItemCategory OFF;
SET IDENTITY_INSERT FoodItemIngredient ON;
INSERT INTO FoodItemIngredient (fii_id, food_item_id, ingredient_id, quantity_required) VALUES
(1, 101, 6, 0.33), (2, 101, 31, 0.05), (3, 101, 8, 0.01), (4, 102, 7, 0.15), (5, 102, 11, 0.2), 
(6, 102, 21, 0.005), (7, 103, 5, 0.15), (8, 103, 16, 0.1), (9, 103, 12, 0.03), (10, 104, 10, 0.05), 
(11, 104, 33, 0.002), (12, 104, 7, 0.2), (13, 105, 1, 0.1), (14, 105, 9, 0.03), (15, 106, 3, 0.05), 
(16, 106, 14, 0.05), (17, 107, 29, 1.0), (18, 108, 28, 0.01), (19, 109, 34, 0.1), (20, 109, 17, 0.05), 
(21, 110, 24, 0.2), (22, 110, 13, 0.03), (23, 111, 22, 0.3), (24, 112, 26, 0.1), (25, 112, 3, 0.03), 
(26, 113, 5, 0.15), (27, 113, 32, 0.03), (28, 114, 7, 0.4), (29, 114, 15, 0.1), (30, 115, 11, 0.15),
(31, 116, 5, 0.15), (32, 116, 8, 0.05), (33, 116, 11, 0.15), (34, 117, 6, 0.25), (35, 117, 13, 0.02),
(36, 118, 11, 0.25), (37, 118, 25, 0.01), (38, 119, 16, 0.05), (39, 119, 7, 0.02), (40, 120, 3, 0.01),
(41, 121, 28, 0.01), (42, 121, 15, 0.2), (43, 122, 14, 0.1), (44, 122, 32, 0.03), (45, 123, 1, 0.05),
(46, 123, 3, 0.03), (47, 124, 5, 0.2), (48, 124, 23, 0.05), (49, 125, 11, 0.15), (50, 125, 18, 0.05),
(51, 125, 17, 0.05), (52, 126, 16, 0.08), (53, 126, 12, 0.02), (54, 128, 6, 0.3), (55, 128, 38, 0.05),
(56, 129, 22, 0.3), (57, 129, 13, 0.02), (58, 130, 14, 0.1), (59, 130, 28, 0.01), (60, 131, 26, 0.15),
(61, 131, 12, 0.05), (62, 132, 11, 0.15), (63, 132, 7, 0.15), (64, 133, 31, 0.1), (65, 133, 33, 0.001),
(66, 135, 15, 0.25), (67, 135, 3, 0.02), (68, 136, 23, 0.05), (69, 136, 32, 0.02), (70, 137, 10, 0.01),
(71, 138, 6, 0.15), (72, 138, 7, 0.2), (73, 139, 1, 0.1), (74, 139, 25, 0.01), (75, 140, 3, 0.08),
(76, 140, 14, 0.1), (77, 104, 9, 0.02), (78, 105, 10, 0.05), (79, 111, 2, 0.005), (80, 119, 40, 0.01);
SET IDENTITY_INSERT FoodItemIngredient OFF;
SET IDENTITY_INSERT [User] ON;
INSERT INTO [User] (user_id, full_name, email, password_hash, phone, status, created_at) VALUES
(1001, 'Admin User', 'admin@food.com', 'hashed_admin_1', '555-2001', 1, '2025-11-01'),
(1002, 'Manager Smith', 'manager.s@food.com', 'hashed_manager_2', '555-2002', 1, '2025-11-05'),
(1003, 'Chef Gordon', 'gordon.c@food.com', 'hashed_chef_3', '555-2003', 1, '2025-11-05'),
(1004, 'Inventory Johnson', 'inventory.j@food.com', 'hashed_inv_4', '555-2004', 1, '2025-11-10'),
(1005, 'Waiter Alice', 'waiter.a@food.com', 'hashed_waiter_5', '555-2005', 1, '2025-11-15'),
(1006, 'Cashier Bob', 'cashier.b@food.com', 'hashed_cashier_6', '555-2006', 1, '2025-11-15'),
(1007, 'Delivery Charlie', 'driver.c@food.com', 'hashed_driver_7', '555-2007', 1, '2025-11-20'),
(1008, 'Staff David', 'staff.d@food.com', 'hashed_staff_8', '555-2008', 1, '2025-11-20'),
(1009, 'Manager Emily', 'manager.e@food.com', 'hashed_manager_9', '555-2009', 1, '2025-11-25'),
(1010, 'Chef Ben', 'chef.b@food.com', 'hashed_chef_10', '555-2010', 1, '2025-11-25'),
(1011, 'Waiter Fiona', 'waiter.f@food.com', 'hashed_waiter_11', '555-2011', 1, '2025-11-28'),
(1012, 'Cashier Greg', 'cashier.g@food.com', 'hashed_cashier_12', '555-2012', 1, '2025-11-28'),
(1013, 'Staff Hannah', 'staff.h@food.com', 'hashed_staff_13', '555-2013', 1, '2025-12-01'),
(1014, 'Inventory Ian', 'inventory.i@food.com', 'hashed_inv_14', '555-2014', 1, '2025-12-01'),
(1015, 'Supplier Lisa', 'supplier.l@food.com', 'hashed_supplier_15', '555-2015', 1, '2025-12-05'),
(1016, 'Chef Maria', 'chef.m@food.com', 'hashed_chef_16', '555-2016', 1, '2025-12-05'),
(1017, 'Waiter Nick', 'waiter.n@food.com', 'hashed_waiter_17', '555-2017', 1, '2025-12-10'),
(1018, 'Marketing Peter', 'marketing.p@food.com', 'hashed_mktg_18', '555-2018', 1, '2025-12-10'),
(1019, 'Staff Quinn', 'staff.q@food.com', 'hashed_staff_19', '555-2019', 1, '2025-12-15'),
(1020, 'Manager Ryan', 'manager.r@food.com', 'hashed_manager_20', '555-2020', 1, '2025-12-15');
SET IDENTITY_INSERT [User] OFF;
SET IDENTITY_INSERT UserRole ON;
INSERT INTO UserRole (user_role_id, user_id, role_id) VALUES
(1, 1001, 1), (2, 1002, 2), (3, 1003, 3), (4, 1004, 8), (5, 1005, 5), (6, 1006, 6),
(7, 1007, 7), (8, 1008, 4), (9, 1009, 2), (10, 1010, 3), (11, 1011, 5), (12, 1012, 6),
(13, 1013, 4), (14, 1014, 8), (15, 1015, 9), (16, 1016, 3), (17, 1017, 5), (18, 1018, 10),
(19, 1019, 4), (20, 1020, 2), (21, 1001, 2), (22, 1003, 4), (23, 1004, 2), (24, 1005, 6),
(25, 1006, 4), (26, 1009, 8), (27, 1010, 4), (28, 1014, 2), (29, 1016, 4), (30, 1019, 5);
SET IDENTITY_INSERT UserRole OFF;
SET IDENTITY_INSERT Stock ON;
INSERT INTO Stock (stock_id, food_item_id, quantity_available, last_updated) VALUES
(1, 101, 150.00, GETDATE()), (2, 102, 200.00, GETDATE()), (3, 103, 180.00, GETDATE()), 
(4, 104, 175.00, GETDATE()), (5, 105, 300.00, GETDATE()), (6, 106, 120.00, GETDATE()), 
(7, 107, 500.00, GETDATE()), (8, 108, 450.00, GETDATE()), (9, 109, 140.00, GETDATE()), 
(10, 110, 110.00, GETDATE()), (11, 111, 600.00, GETDATE()), (12, 112, 100.00, GETDATE()), 
(13, 113, 160.00, GETDATE()), (14, 114, 250.00, GETDATE()), (15, 115, 130.00, GETDATE()), 
(16, 116, 190.00, GETDATE()), (17, 117, 90.00, GETDATE()), (18, 118, 85.00, GETDATE()), 
(19, 119, 350.00, GETDATE()), (20, 120, 400.00, GETDATE()), (21, 121, 220.00, GETDATE()), 
(22, 122, 125.00, GETDATE()), (23, 123, 550.00, GETDATE()), (24, 124, 170.00, GETDATE()), 
(25, 125, 210.00, GETDATE()), (26, 126, 155.00, GETDATE()), (27, 127, 700.00, GETDATE()), 
(28, 128, 70.00, GETDATE()), (29, 129, 300.00, GETDATE()), (30, 130, 95.00, GETDATE()), 
(31, 131, 165.00, GETDATE()), (32, 132, 135.00, GETDATE()), (33, 133, 180.00, GETDATE()), 
(34, 134, 320.00, GETDATE()), (35, 135, 280.00, GETDATE()), (36, 136, 145.00, GETDATE()), 
(37, 137, 260.00, GETDATE()), (38, 138, 175.00, GETDATE()), (39, 139, 105.00, GETDATE()), 
(40, 140, 115.00, GETDATE());
SET IDENTITY_INSERT Stock OFF;
SET IDENTITY_INSERT ItemUnit ON;
INSERT INTO ItemUnit (item_unit_id, food_item_id, unit_id, is_default) VALUES
(1, 101, 5, 1), (2, 102, 5, 1), (3, 103, 5, 1), (4, 104, 5, 1), (5, 105, 5, 1), 
(6, 106, 5, 1), (7, 107, 4, 1), (8, 108, 4, 1), (9, 109, 5, 1), (10, 110, 5, 1), 
(11, 111, 4, 1), (12, 112, 5, 1), (13, 113, 5, 1), (14, 114, 4, 1), (15, 115, 5, 1), 
(16, 116, 5, 1), (17, 117, 5, 1), (18, 118, 5, 1), (19, 119, 5, 1), (20, 120, 4, 1), 
(21, 121, 4, 1), (22, 122, 5, 1), (23, 123, 5, 1), (24, 124, 5, 1), (25, 125, 5, 1), 
(26, 126, 5, 1), (27, 127, 4, 1), (28, 128, 5, 1), (29, 129, 4, 1), (30, 130, 5, 1), 
(31, 131, 5, 1), (32, 132, 5, 1), (33, 133, 5, 1), (34, 134, 4, 1), (35, 135, 4, 1), 
(36, 136, 5, 1), (37, 137, 4, 1), (38, 138, 5, 1), (39, 139, 5, 1), (40, 140, 5, 1);
SET IDENTITY_INSERT ItemUnit OFF;
SET IDENTITY_INSERT Purchase ON;
INSERT INTO Purchase (purchase_id, supplier_id, purchase_date, total_amount, created_at) VALUES
(5001, 1, '2025-09-02', 450.00, '2025-09-02 09:10:00'),
(5002, 3, '2025-09-05', 620.50, '2025-09-05 10:25:00'),
(5003, 2, '2025-09-09', 315.75, '2025-09-09 11:40:00'),
(5004, 5, '2025-09-15', 700.00, '2025-09-15 14:00:00'),
(5005, 4, '2025-09-20', 150.00, '2025-09-20 08:30:00'),
(5006, 10, '2025-09-25', 400.00, '2025-09-25 10:00:00'),
(5007, 12, '2025-09-28', 210.00, '2025-09-28 12:00:00'),
(5008, 1, '2025-10-01', 550.00, '2025-10-01 09:30:00'),
(5009, 3, '2025-10-04', 710.25, '2025-10-04 11:00:00'),
(5010, 2, '2025-10-08', 350.50, '2025-10-08 13:00:00'),
(5011, 6, '2025-10-14', 900.00, '2025-10-14 15:00:00'),
(5012, 1, '2025-10-18', 490.00, '2025-10-18 08:45:00'),
(5013, 7, '2025-10-22', 250.00, '2025-10-22 10:15:00'),
(5014, 11, '2025-10-26', 180.00, '2025-10-26 11:30:00'),
(5015, 8, '2025-10-30', 520.00, '2025-10-30 14:30:00'),
(5016, 1, '2025-11-03', 480.00, '2025-11-03 09:00:00'),
(5017, 3, '2025-11-06', 650.50, '2025-11-06 10:45:00'),
(5018, 2, '2025-11-10', 330.75, '2025-11-10 12:00:00'),
(5019, 5, '2025-11-16', 750.00, '2025-11-16 14:15:00'),
(5020, 4, '2025-11-21', 160.00, '2025-11-21 08:30:00'),
(5021, 10, '2025-11-26', 420.00, '2025-11-26 10:00:00'),
(5022, 12, '2025-11-29', 220.00, '2025-11-29 12:00:00'),
(5023, 15, '2025-11-05', 150.00, '2025-11-05 13:00:00'),
(5024, 16, '2025-11-12', 300.00, '2025-11-12 11:00:00'),
(5025, 17, '2025-11-19', 120.00, '2025-11-19 09:00:00'),
(5026, 18, '2025-10-03', 450.00, '2025-10-03 16:00:00'),
(5027, 19, '2025-10-10', 250.00, '2025-10-10 10:00:00'),
(5028, 20, '2025-10-17', 110.00, '2025-10-17 11:00:00'),
(5029, 9, '2025-11-24', 280.00, '2025-11-24 09:00:00'),
(5030, 13, '2025-11-30', 500.00, '2025-11-30 15:00:00');
SET IDENTITY_INSERT Purchase OFF;
SET IDENTITY_INSERT PurchaseItem ON;
INSERT INTO PurchaseItem (purchase_item_id, purchase_id, food_item_id, quantity, unit_price) VALUES
-- Purchase 5001: Dairy King
(6001, 5001, 102, 50, 8.00), (6002, 5001, 112, 10, 5.00), (6003, 5001, 130, 15, 6.00), (6004, 5001, 132, 20, 5.50),
-- Purchase 5002: Prime Meats
(6005, 5002, 101, 40, 7.00), (6006, 5002, 117, 20, 15.00), (6007, 5002, 128, 15, 20.00),
-- Purchase 5003: Fresh Veggie
(6008, 5003, 103, 30, 4.00), (6009, 5003, 119, 50, 2.00), (6010, 5003, 137, 40, 2.50),
-- Purchase 5004: Beverage Systems
(6011, 5004, 107, 100, 1.50), (6012, 5004, 120, 150, 1.80), (6013, 5004, 127, 50, 1.00),
-- Purchase 5005: Global Spice
(6014, 5005, 104, 10, 10.00), (6015, 5005, 138, 15, 8.00),
-- Purchase 5006: Grains & Pasta
(6016, 5006, 110, 20, 12.00), (6017, 5006, 131, 25, 9.00),
-- Purchase 5007: Local Farm Eggs
(6018, 5007, 123, 50, 1.50), (6019, 5007, 106, 10, 5.00),
-- Purchase 5008: Dairy King
(6020, 5008, 102, 60, 8.00), (6021, 5008, 112, 12, 5.00), (6022, 5008, 130, 18, 6.00),
-- Purchase 5009: Prime Meats
(6023, 5009, 101, 50, 7.00), (6024, 5009, 117, 25, 15.00), (6025, 5009, 128, 18, 20.00),
-- Purchase 5010: Fresh Veggie
(6026, 5010, 103, 35, 4.00), (6027, 5010, 119, 60, 2.00), (6028, 5010, 137, 45, 2.50),
-- Purchase 5011: Bakery Flour Mill
(6029, 5011, 105, 100, 2.50), (6030, 5011, 123, 150, 1.50), (6031, 5011, 122, 30, 5.00), (6032, 5011, 136, 30, 7.00),
-- Purchase 5012: Dairy King
(6033, 5012, 102, 55, 8.00), (6034, 5012, 132, 25, 5.50),
-- Purchase 5013: Oil & Fat
(6035, 5013, 111, 100, 2.00), (6036, 5013, 129, 50, 2.50),
-- Purchase 5014: Organic Foods
(6037, 5014, 109, 20, 6.00), (6038, 5014, 140, 15, 7.00),
-- Purchase 5015: Seafood Express
(6039, 5015, 110, 25, 15.00), (6040, 5015, 118, 20, 13.50), (6041, 5015, 139, 15, 9.00),
-- Purchase 5016: Dairy King
(6042, 5016, 102, 65, 8.00), (6043, 5016, 112, 15, 5.00), (6044, 5016, 130, 20, 6.00),
-- Purchase 5017: Prime Meats
(6045, 5017, 101, 55, 7.00), (6046, 5017, 117, 30, 15.00), (6047, 5017, 128, 20, 20.00),
-- Purchase 5018: Fresh Veggie
(6048, 5018, 103, 40, 4.00), (6049, 5018, 119, 70, 2.00), (6050, 5018, 137, 50, 2.50),
-- Purchase 5019: Beverage Systems
(6051, 5019, 107, 110, 1.50), (6052, 5019, 120, 160, 1.80), (6053, 5019, 127, 60, 1.00),
-- Purchase 5020: Global Spice
(6054, 5020, 104, 15, 10.00), (6055, 5020, 138, 20, 8.00),
-- Purchase 5021: Grains & Pasta
(6056, 5021, 110, 25, 12.00), (6057, 5021, 131, 30, 9.00),
-- Purchase 5022: Local Farm Eggs
(6058, 5022, 123, 60, 1.50), (6059, 5022, 106, 15, 5.00),
-- Purchase 5023: Paper & Packaging
(6060, 5023, 113, 50, 4.00), (6061, 5023, 126, 40, 3.00),
-- Purchase 5024: Specialty Cheese
(6062, 5024, 102, 30, 9.00), (6063, 5024, 116, 20, 10.00), (6064, 5024, 125, 25, 11.00),
-- Purchase 5025: Premium Coffee
(6065, 5025, 108, 50, 2.00), (6066, 5025, 121, 40, 3.00), (6067, 5025, 135, 30, 2.50),
-- Purchase 5026: Wine & Spirits (assuming some items are inventory tracked)
(6068, 5026, 120, 100, 2.00), (6069, 5026, 107, 50, 1.50),
-- Purchase 5027: Asian Imports
(6070, 5027, 104, 20, 8.00), (6071, 5027, 138, 15, 9.00),
-- Purchase 5028: Seasonal Fruit
(6072, 5028, 132, 20, 6.00), (6073, 5028, 114, 25, 3.50),
-- Purchase 5029: Produce Wholesale
(6074, 5029, 109, 30, 5.50), (6075, 5029, 137, 40, 2.50),
-- Purchase 5030: Frozen Goods
(6076, 5030, 124, 30, 5.00), (6077, 5030, 133, 20, 7.00);



SET IDENTITY_INSERT PurchaseItem OFF;
select * from PurchaseItem;


SET IDENTITY_INSERT [Order] ON;
INSERT INTO [Order] (order_id, order_date, order_type, total_amount) VALUES
(8001, '2025-09-01 19:00:00', 'Delivery', 38.49),
(8002, '2025-09-01 19:15:00', 'Dine-In', 25.50),
(8003, '2025-09-02 12:30:00', 'Takeaway', 15.99),
(8004, '2025-09-02 18:45:00', 'Delivery', 51.50),
(8005, '2025-09-03 13:00:00', 'Dine-In', 40.00),
(8006, '2025-09-03 20:00:00', 'Delivery', 18.00),
(8007, '2025-09-04 12:00:00', 'Takeaway', 30.00),
(8008, '2025-09-04 19:30:00', 'Dine-In', 62.98),
(8009, '2025-09-05 13:15:00', 'Delivery', 22.99),
(8010, '2025-09-05 19:45:00', 'Takeaway', 12.99),
(8011, '2025-09-06 12:10:00', 'Dine-In', 35.50),
(8012, '2025-09-06 18:30:00', 'Delivery', 49.99),
(8013, '2025-09-07 13:45:00', 'Takeaway', 20.00),
(8014, '2025-09-07 19:00:00', 'Dine-In', 75.00),
(8015, '2025-09-08 12:50:00', 'Delivery', 31.50),
(8016, '2025-09-08 19:20:00', 'Takeaway', 19.50),
(8017, '2025-09-09 13:10:00', 'Dine-In', 42.99),
(8018, '2025-09-09 18:55:00', 'Delivery', 28.50),
(8019, '2025-09-10 12:40:00', 'Takeaway', 17.50),
(8020, '2025-09-10 19:05:00', 'Dine-In', 55.00),
(8021, '2025-09-11 13:00:00', 'Delivery', 26.99),
(8022, '2025-09-11 20:15:00', 'Takeaway', 14.50),
(8023, '2025-09-12 12:25:00', 'Dine-In', 33.00),
(8024, '2025-09-12 19:35:00', 'Delivery', 41.50),
(8025, '2025-09-13 13:10:00', 'Takeaway', 22.50),
(8026, '2025-09-13 19:40:00', 'Dine-In', 68.00),
(8027, '2025-09-14 12:55:00', 'Delivery', 29.99),
(8028, '2025-09-14 20:05:00', 'Takeaway', 16.50),
(8029, '2025-09-15 13:30:00', 'Dine-In', 37.50),
(8030, '2025-09-15 18:40:00', 'Delivery', 45.99),
(8031, '2025-09-16 12:15:00', 'Takeaway', 24.00),
(8032, '2025-09-16 19:10:00', 'Dine-In', 50.50),
(8033, '2025-09-17 13:05:00', 'Delivery', 33.50),
(8034, '2025-09-17 19:50:00', 'Takeaway', 18.00),
(8035, '2025-09-18 12:35:00', 'Dine-In', 44.99),
(8036, '2025-09-18 19:45:00', 'Delivery', 27.99),
(8037, '2025-09-19 13:20:00', 'Takeaway', 21.50),
(8038, '2025-09-19 20:25:00', 'Dine-In', 58.00),
(8039, '2025-09-20 12:45:00', 'Delivery', 36.99),
(8040, '2025-09-20 19:15:00', 'Takeaway', 15.00),
(8041, '2025-09-21 13:00:00', 'Dine-In', 40.50),
(8042, '2025-09-21 19:30:00', 'Delivery', 52.00),
(8043, '2025-09-22 12:50:00', 'Takeaway', 23.50),
(8044, '2025-09-22 18:55:00', 'Dine-In', 65.50),
(8045, '2025-09-23 13:10:00', 'Delivery', 30.99),
(8046, '2025-09-23 20:00:00', 'Takeaway', 17.00),
(8047, '2025-09-24 12:40:00', 'Dine-In', 48.00),
(8048, '2025-09-24 19:20:00', 'Delivery', 34.50),
(8049, '2025-09-25 13:35:00', 'Takeaway', 25.50),
(8050, '2025-09-25 19:55:00', 'Dine-In', 70.99),
(8051, '2025-09-26 12:10:00', 'Delivery', 32.50),
(8052, '2025-09-26 19:45:00', 'Takeaway', 19.00),
(8053, '2025-09-27 13:00:00', 'Dine-In', 55.50),
(8054, '2025-09-27 20:10:00', 'Delivery', 40.99),
(8055, '2025-09-28 12:30:00', 'Takeaway', 26.00),
(8056, '2025-09-28 18:40:00', 'Dine-In', 60.00),
(8057, '2025-09-29 13:15:00', 'Delivery', 38.00),
(8058, '2025-09-29 19:25:00', 'Takeaway', 20.99),
(8059, '2025-09-30 12:50:00', 'Dine-In', 43.50),
(8060, '2025-09-30 20:00:00', 'Delivery', 50.00),
(8061, '2025-10-01 12:05:00', 'Takeaway', 28.99),
(8062, '2025-10-01 19:10:00', 'Dine-In', 72.50),
(8063, '2025-10-02 13:00:00', 'Delivery', 35.00),
(8064, '2025-10-02 19:50:00', 'Takeaway', 18.50),
(8065, '2025-10-03 12:45:00', 'Dine-In', 41.99),
(8066, '2025-10-03 19:35:00', 'Delivery', 47.50),
(8067, '2025-10-04 13:10:00', 'Takeaway', 21.00),
(8068, '2025-10-04 20:20:00', 'Dine-In', 63.00),
(8069, '2025-10-05 12:20:00', 'Delivery', 39.50),
(8070, '2025-10-05 19:40:00', 'Takeaway', 16.00),
(8071, '2025-10-06 13:05:00', 'Dine-In', 46.50),
(8072, '2025-10-06 18:50:00', 'Delivery', 33.99),
(8073, '2025-10-07 12:35:00', 'Takeaway', 25.00),
(8074, '2025-10-07 19:25:00', 'Dine-In', 59.50),
(8075, '2025-10-08 13:00:00', 'Delivery', 27.50),
(8076, '2025-10-08 20:05:00', 'Takeaway', 14.99),
(8077, '2025-10-09 12:55:00', 'Dine-In', 38.99),
(8078, '2025-10-09 19:15:00', 'Delivery', 42.50),
(8079, '2025-10-10 13:20:00', 'Takeaway', 23.00),
(8080, '2025-10-10 19:45:00', 'Dine-In', 67.50),
(8081, '2025-10-11 12:40:00', 'Delivery', 30.00),
(8082, '2025-10-11 20:30:00', 'Takeaway', 17.50),
(8083, '2025-10-12 13:10:00', 'Dine-In', 49.00),
(8084, '2025-10-12 18:45:00', 'Delivery', 51.99),
(8085, '2025-10-13 12:15:00', 'Takeaway', 29.50),
(8086, '2025-10-13 19:20:00', 'Dine-In', 64.00),
(8087, '2025-10-14 13:00:00', 'Delivery', 36.50),
(8088, '2025-10-14 19:55:00', 'Takeaway', 15.50),
(8089, '2025-10-15 12:45:00', 'Dine-In', 43.99),
(8090, '2025-10-15 19:00:00', 'Delivery', 28.99),
(8091, '2025-10-16 13:30:00', 'Takeaway', 22.00),
(8092, '2025-10-16 20:10:00', 'Dine-In', 56.50),
(8093, '2025-10-17 12:50:00', 'Delivery', 31.00),
(8094, '2025-10-17 19:35:00', 'Takeaway', 19.50),
(8095, '2025-10-18 13:15:00', 'Dine-In', 47.00),
(8096, '2025-10-18 20:25:00', 'Delivery', 37.50),
(8097, '2025-10-19 12:35:00', 'Takeaway', 24.50),
(8098, '2025-10-19 19:40:00', 'Dine-In', 69.00),
(8099, '2025-10-20 13:00:00', 'Delivery', 33.99),
(8100, '2025-10-20 19:15:00', 'Takeaway', 16.50),
(8101, '2025-10-21 12:25:00', 'Dine-In', 40.00),
(8102, '2025-10-21 19:50:00', 'Delivery', 53.50),
(8103, '2025-10-22 13:10:00', 'Takeaway', 25.00),
(8104, '2025-10-22 18:50:00', 'Dine-In', 61.99),
(8105, '2025-10-23 12:40:00', 'Delivery', 39.00),
(8106, '2025-10-23 20:00:00', 'Takeaway', 18.00),
(8107, '2025-10-24 13:05:00', 'Dine-In', 45.50),
(8108, '2025-10-24 19:20:00', 'Delivery', 34.99),
(8109, '2025-10-25 13:30:00', 'Takeaway', 21.50),
(8110, '2025-10-25 19:45:00', 'Dine-In', 71.50),
(8111, '2025-10-26 12:15:00', 'Delivery', 32.00),
(8112, '2025-10-26 20:15:00', 'Takeaway', 20.99),
(8113, '2025-10-27 13:00:00', 'Dine-In', 50.50),
(8114, '2025-10-27 18:40:00', 'Delivery', 41.50),
(8115, '2025-10-28 12:55:00', 'Takeaway', 26.50),
(8116, '2025-10-28 19:25:00', 'Dine-In', 65.00),
(8117, '2025-10-29 13:10:00', 'Delivery', 35.50),
(8118, '2025-10-29 19:55:00', 'Takeaway', 17.00),
(8119, '2025-10-30 12:30:00', 'Dine-In', 44.00),
(8120, '2025-10-30 19:05:00', 'Delivery', 29.99),
(8121, '2025-10-31 13:40:00', 'Takeaway', 23.00),
(8122, '2025-10-31 20:30:00', 'Dine-In', 58.50),
(8123, '2025-11-01 12:45:00', 'Delivery', 37.50),
(8124, '2025-11-01 19:15:00', 'Takeaway', 15.50),
(8125, '2025-11-02 13:00:00', 'Dine-In', 49.99),
(8126, '2025-11-02 19:40:00', 'Delivery', 54.00),
(8127, '2025-11-03 12:50:00', 'Takeaway', 28.00),
(8128, '2025-11-03 18:55:00', 'Dine-In', 70.00),
(8129, '2025-11-04 13:15:00', 'Delivery', 33.99),
(8130, '2025-11-04 20:00:00', 'Takeaway', 19.50),
(8131, '2025-11-05 12:35:00', 'Dine-In', 42.50),
(8132, '2025-11-05 19:20:00', 'Delivery', 48.99),
(8133, '2025-11-06 13:00:00', 'Takeaway', 24.50),
(8134, '2025-11-06 19:45:00', 'Dine-In', 62.50),
(8135, '2025-11-07 12:55:00', 'Delivery', 36.00),
(8136, '2025-11-07 20:10:00', 'Takeaway', 18.50),
(8137, '2025-11-08 13:20:00', 'Dine-In', 45.99),
(8138, '2025-11-08 18:30:00', 'Delivery', 31.50),
(8139, '2025-11-09 12:40:00', 'Takeaway', 22.50),
(8140, '2025-11-09 19:35:00', 'Dine-In', 57.00),
(8141, '2025-11-10 13:05:00', 'Delivery', 40.50),
(8142, '2025-11-10 20:25:00', 'Takeaway', 16.00),
(8143, '2025-11-11 12:25:00', 'Dine-In', 47.99),
(8144, '2025-11-11 19:10:00', 'Delivery', 50.99),
(8145, '2025-11-12 13:15:00', 'Takeaway', 25.50),
(8146, '2025-11-12 19:50:00', 'Dine-In', 68.50),
(8147, '2025-11-13 12:50:00', 'Delivery', 34.50),
(8148, '2025-11-13 18:45:00', 'Takeaway', 20.00),
(8149, '2025-11-14 13:00:00', 'Dine-In', 43.00),
(8150, '2025-11-14 19:30:00', 'Delivery', 30.99),
(8151, '2025-11-15 13:25:00', 'Takeaway', 24.00),
(8152, '2025-11-15 20:05:00', 'Dine-In', 59.00),
(8153, '2025-11-16 12:40:00', 'Delivery', 38.99),
(8154, '2025-11-16 19:45:00', 'Takeaway', 17.50),
(8155, '2025-11-17 13:10:00', 'Dine-In', 46.50),
(8156, '2025-11-17 18:55:00', 'Delivery', 52.50),
(8157, '2025-11-18 12:20:00', 'Takeaway', 26.00),
(8158, '2025-11-18 19:20:00', 'Dine-In', 61.50),
(8159, '2025-11-19 13:05:00', 'Delivery', 32.99),
(8160, '2025-11-19 20:00:00', 'Takeaway', 18.50),
(8161, '2025-11-20 12:55:00', 'Dine-In', 40.00),
(8162, '2025-11-20 19:15:00', 'Delivery', 49.50),
(8163, '2025-11-21 13:30:00', 'Takeaway', 21.00),
(8164, '2025-11-21 20:25:00', 'Dine-In', 64.99),
(8165, '2025-11-22 12:45:00', 'Delivery', 35.00),
(8166, '2025-11-22 19:40:00', 'Takeaway', 19.99),
(8167, '2025-11-23 13:10:00', 'Dine-In', 48.50),
(8168, '2025-11-23 18:30:00', 'Delivery', 51.50),
(8169, '2025-11-24 12:50:00', 'Takeaway', 27.50),
(8170, '2025-11-24 19:55:00', 'Dine-In', 69.50),
(8171, '2025-11-25 13:00:00', 'Delivery', 33.00),
(8172, '2025-11-25 19:10:00', 'Takeaway', 16.50),
(8173, '2025-11-26 12:35:00', 'Dine-In', 44.99),
(8174, '2025-11-26 20:05:00', 'Delivery', 47.99),
(8175, '2025-11-27 13:15:00', 'Takeaway', 22.50),
(8176, '2025-11-27 18:40:00', 'Dine-In', 60.50),
(8177, '2025-11-28 12:55:00', 'Delivery', 39.50),
(8178, '2025-11-28 19:30:00', 'Takeaway', 18.00),
(8179, '2025-11-29 13:00:00', 'Dine-In', 53.00),
(8180, '2025-11-29 19:45:00', 'Delivery', 55.50),
(8181, '2025-11-30 12:20:00', 'Takeaway', 29.99),
(8182, '2025-11-30 19:15:00', 'Dine-In', 66.00),
(8183, '2025-11-01 08:30:00', 'Dine-In', 10.99),
(8184, '2025-11-02 09:00:00', 'Takeaway', 7.00),
(8185, '2025-11-03 08:45:00', 'Dine-In', 14.50),
(8186, '2025-11-04 09:10:00', 'Takeaway', 8.50),
(8187, '2025-11-05 08:35:00', 'Dine-In', 12.00),
(8188, '2025-11-06 09:05:00', 'Takeaway', 9.50),
(8189, '2025-11-07 08:50:00', 'Dine-In', 16.00),
(8190, '2025-11-08 09:15:00', 'Takeaway', 10.50),
(8191, '2025-11-09 08:40:00', 'Dine-In', 11.50),
(8192, '2025-11-10 09:20:00', 'Takeaway', 7.99),
(8193, '2025-11-11 08:55:00', 'Dine-In', 13.50),
(8194, '2025-11-12 09:00:00', 'Takeaway', 8.00),
(8195, '2025-11-13 08:30:00', 'Dine-In', 15.00),
(8196, '2025-11-14 09:05:00', 'Takeaway', 9.00),
(8197, '2025-11-15 08:45:00', 'Dine-In', 12.50),
(8198, '2025-11-16 09:10:00', 'Takeaway', 10.00),
(8199, '2025-11-17 08:50:00', 'Dine-In', 17.00),
(8200, '2025-11-18 09:15:00', 'Takeaway', 11.00),
(8201, '2025-11-19 08:40:00', 'Dine-In', 14.00),
(8202, '2025-11-20 09:20:00', 'Takeaway', 8.99),
(8203, '2025-11-21 08:55:00', 'Dine-In', 15.50),
(8204, '2025-11-22 09:00:00', 'Takeaway', 9.50),
(8205, '2025-11-23 08:30:00', 'Dine-In', 13.99),
(8206, '2025-11-24 09:05:00', 'Takeaway', 7.50),
(8207, '2025-11-25 08:45:00', 'Dine-In', 11.00),
(8208, '2025-11-26 09:10:00', 'Takeaway', 10.99),
(8209, '2025-11-27 08:50:00', 'Dine-In', 16.50),
(8210, '2025-11-28 09:15:00', 'Takeaway', 12.00),
(8211, '2025-11-29 08:40:00', 'Dine-In', 14.99),
(8212, '2025-11-30 09:20:00', 'Takeaway', 8.99),
(8213, '2025-09-02 20:00:00', 'Delivery', 40.00),
(8214, '2025-09-05 13:00:00', 'Dine-In', 32.50),
(8215, '2025-09-08 19:00:00', 'Takeaway', 25.00),
(8216, '2025-09-12 13:30:00', 'Delivery', 45.00),
(8217, '2025-09-15 19:50:00', 'Dine-In', 50.00),
(8218, '2025-09-18 12:40:00', 'Takeaway', 22.00),
(8219, '2025-09-22 19:00:00', 'Delivery', 55.00),
(8220, '2025-09-25 13:20:00', 'Dine-In', 38.50),
(8221, '2025-09-28 19:30:00', 'Takeaway', 30.00),
(8222, '2025-10-01 13:45:00', 'Delivery', 42.00),
(8223, '2025-10-04 19:00:00', 'Dine-In', 52.50),
(8224, '2025-10-07 12:50:00', 'Takeaway', 27.00),
(8225, '2025-10-10 19:30:00', 'Delivery', 48.00),
(8226, '2025-10-14 13:20:00', 'Dine-In', 35.00),
(8227, '2025-10-17 19:00:00', 'Takeaway', 24.50),
(8228, '2025-10-21 12:45:00', 'Delivery', 50.00),
(8229, '2025-10-24 19:10:00', 'Dine-In', 40.50),
(8230, '2025-10-28 13:00:00', 'Takeaway', 31.50),
(8231, '2025-10-31 19:00:00', 'Delivery', 44.50),
(8232, '2025-11-03 13:30:00', 'Dine-In', 36.50),
(8233, '2025-11-06 19:50:00', 'Takeaway', 29.00),
(8234, '2025-11-10 12:40:00', 'Delivery', 55.00),
(8235, '2025-11-13 19:30:00', 'Dine-In', 58.00),
(8236, '2025-11-17 13:00:00', 'Takeaway', 23.50),
(8237, '2025-11-20 19:00:00', 'Delivery', 46.00),
(8238, '2025-11-24 13:10:00', 'Dine-In', 39.99),
(8239, '2025-11-27 19:50:00', 'Takeaway', 34.00),
(8240, '2025-11-30 13:00:00', 'Delivery', 51.00),
(8241, '2025-11-28 19:30:00', 'Dine-In', 45.00),
(8242, '2025-11-28 20:00:00', 'Delivery', 37.99),
(8243, '2025-11-29 12:45:00', 'Takeaway', 28.50),
(8244, '2025-11-29 19:00:00', 'Dine-In', 50.00),
(8245, '2025-11-30 13:30:00', 'Delivery', 21.99),
(8246, '2025-11-30 19:00:00', 'Dine-In', 44.99),
(8247, '2025-11-30 19:15:00', 'Delivery', 32.50),
(8248, '2025-11-30 19:45:00', 'Takeaway', 18.99),
(8249, '2025-11-30 20:00:00', 'Dine-In', 60.00),
(8250, '2025-11-30 20:15:00', 'Delivery', 35.99);
SET IDENTITY_INSERT [Order] OFF;

SET IDENTITY_INSERT Payment ON;
INSERT INTO Payment (payment_id, amount, method, payment_date) VALUES
(9001, 38.49, 'Credit Card', '2025-09-01 19:01:00'),
(9002, 25.50, 'Cash', '2025-09-01 19:18:00'),
(9003, 15.99, 'Credit Card', '2025-09-02 12:35:00'),
(9004, 51.50, 'App Payment', '2025-09-02 18:48:00'),
(9005, 40.00, 'Cash', '2025-09-03 13:05:00'),
(9006, 18.00, 'Credit Card', '2025-09-03 20:03:00'),
(9007, 30.00, 'Cash', '2025-09-04 12:05:00'),
(9008, 62.98, 'Credit Card', '2025-09-04 19:35:00'),
(9009, 22.99, 'App Payment', '2025-09-05 13:20:00'),
(9010, 12.99, 'Cash', '2025-09-05 19:50:00'),
(9011, 35.50, 'Credit Card', '2025-09-06 12:15:00'),
(9012, 49.99, 'App Payment', '2025-09-06 18:35:00'),
(9013, 20.00, 'Cash', '2025-09-07 13:50:00'),
(9014, 75.00, 'Credit Card', '2025-09-07 19:05:00'),
(9015, 31.50, 'App Payment', '2025-09-08 12:55:00'),
(9016, 19.50, 'Cash', '2025-09-08 19:25:00'),
(9017, 42.99, 'Credit Card', '2025-09-09 13:15:00'),
(9018, 28.50, 'App Payment', '2025-09-09 19:00:00'),
(9019, 17.50, 'Cash', '2025-09-10 12:45:00'),
(9020, 55.00, 'Credit Card', '2025-09-10 19:10:00'),
(9021, 26.99, 'App Payment', '2025-09-11 13:05:00'),
(9022, 14.50, 'Cash', '2025-09-11 20:20:00'),
(9023, 33.00, 'Credit Card', '2025-09-12 12:30:00'),
(9024, 41.50, 'App Payment', '2025-09-12 19:40:00'),
(9025, 22.50, 'Cash', '2025-09-13 13:15:00'),
(9026, 68.00, 'Credit Card', '2025-09-13 19:45:00'),
(9027, 29.99, 'App Payment', '2025-09-14 13:00:00'),
(9028, 16.50, 'Cash', '2025-09-14 20:10:00'),
(9029, 37.50, 'Credit Card', '2025-09-15 13:35:00'),
(9030, 45.99, 'App Payment', '2025-09-15 18:45:00'),
(9031, 24.00, 'Cash', '2025-09-16 12:20:00'),
(9032, 50.50, 'Credit Card', '2025-09-16 19:15:00'),
(9033, 33.50, 'App Payment', '2025-09-17 13:10:00'),
(9034, 18.00, 'Cash', '2025-09-17 19:55:00'),
(9035, 44.99, 'Credit Card', '2025-09-18 12:40:00'),
(9036, 27.99, 'App Payment', '2025-09-18 19:50:00'),
(9037, 21.50, 'Cash', '2025-09-19 13:25:00'),
(9038, 58.00, 'Credit Card', '2025-09-19 20:30:00'),
(9039, 36.99, 'App Payment', '2025-09-20 12:50:00'),
(9040, 15.00, 'Cash', '2025-09-20 19:20:00'),
(9041, 40.50, 'Credit Card', '2025-09-21 13:05:00'),
(9042, 52.00, 'App Payment', '2025-09-21 19:35:00'),
(9043, 23.50, 'Cash', '2025-09-22 12:55:00'),
(9044, 65.50, 'Credit Card', '2025-09-22 19:00:00'),
(9045, 30.99, 'App Payment', '2025-09-23 13:15:00'),
(9046, 17.00, 'Cash', '2025-09-23 20:05:00'),
(9047, 48.00, 'Credit Card', '2025-09-24 12:45:00'),
(9048, 34.50, 'App Payment', '2025-09-24 19:25:00'),
(9049, 25.50, 'Cash', '2025-09-25 13:40:00'),
(9050, 70.99, 'Credit Card', '2025-09-25 20:00:00'),
(9051, 32.50, 'App Payment', '2025-09-26 12:15:00'),
(9052, 19.00, 'Cash', '2025-09-26 19:50:00'),
(9053, 55.50, 'Credit Card', '2025-09-27 13:05:00'),
(9054, 40.99, 'App Payment', '2025-09-27 20:15:00'),
(9055, 26.00, 'Cash', '2025-09-28 12:35:00'),
(9056, 60.00, 'Credit Card', '2025-09-28 18:45:00'),
(9057, 38.00, 'App Payment', '2025-09-29 13:20:00'),
(9058, 20.99, 'Cash', '2025-09-29 19:30:00'),
(9059, 43.50, 'Credit Card', '2025-09-30 12:55:00'),
(9060, 50.00, 'App Payment', '2025-09-30 20:05:00'),
(9061, 28.99, 'Cash', '2025-10-01 12:10:00'),
(9062, 72.50, 'Credit Card', '2025-10-01 19:15:00'),
(9063, 35.00, 'App Payment', '2025-10-02 13:05:00'),
(9064, 18.50, 'Cash', '2025-10-02 19:55:00'),
(9065, 41.99, 'Credit Card', '2025-10-03 12:50:00'),
(9066, 47.50, 'App Payment', '2025-10-03 19:40:00'),
(9067, 21.00, 'Cash', '2025-10-04 13:15:00'),
(9068, 63.00, 'Credit Card', '2025-10-04 20:25:00'),
(9069, 39.50, 'App Payment', '2025-10-05 12:25:00'),
(9070, 16.00, 'Cash', '2025-10-05 19:45:00'),
(9071, 46.50, 'Credit Card', '2025-10-06 13:10:00'),
(9072, 33.99, 'App Payment', '2025-10-06 18:55:00'),
(9073, 25.00, 'Cash', '2025-10-07 12:40:00'),
(9074, 59.50, 'Credit Card', '2025-10-07 19:30:00'),
(9075, 27.50, 'App Payment', '2025-10-08 13:05:00'),
(9076, 14.99, 'Cash', '2025-10-08 20:10:00'),
(9077, 38.99, 'Credit Card', '2025-10-09 13:00:00'),
(9078, 42.50, 'App Payment', '2025-10-09 19:20:00'),
(9079, 23.00, 'Cash', '2025-10-10 13:25:00'),
(9080, 67.50, 'Credit Card', '2025-10-10 19:50:00'),
(9081, 30.00, 'App Payment', '2025-10-11 12:45:00'),
(9082, 17.50, 'Cash', '2025-10-11 20:35:00'),
(9083, 49.00, 'Credit Card', '2025-10-12 13:15:00'),
(9084, 51.99, 'App Payment', '2025-10-12 18:50:00'),
(9085, 29.50, 'Cash', '2025-10-13 12:20:00'),
(9086, 64.00, 'Credit Card', '2025-10-13 19:25:00'),
(9087, 36.50, 'App Payment', '2025-10-14 13:05:00'),
(9088, 15.50, 'Cash', '2025-10-14 20:00:00'),
(9089, 43.99, 'Credit Card', '2025-10-15 12:50:00'),
(9090, 28.99, 'App Payment', '2025-10-15 19:05:00'),
(9091, 22.00, 'Cash', '2025-10-16 13:35:00'),
(9092, 56.50, 'Credit Card', '2025-10-16 20:15:00'),
(9093, 31.00, 'App Payment', '2025-10-17 12:55:00'),
(9094, 19.50, 'Cash', '2025-10-17 19:40:00'),
(9095, 47.00, 'Credit Card', '2025-10-18 13:20:00'),
(9096, 37.50, 'App Payment', '2025-10-18 20:30:00'),
(9097, 24.50, 'Cash', '2025-10-19 12:40:00'),
(9098, 69.00, 'Credit Card', '2025-10-19 19:45:00'),
(9099, 33.99, 'App Payment', '2025-10-20 13:05:00'),
(9100, 16.50, 'Cash', '2025-10-20 19:20:00'),
(9101, 40.00, 'Credit Card', '2025-10-21 12:30:00'),
(9102, 53.50, 'App Payment', '2025-10-21 19:55:00'),
(9103, 25.00, 'Cash', '2025-10-22 13:15:00'),
(9104, 61.99, 'Credit Card', '2025-10-22 18:55:00'),
(9105, 39.00, 'App Payment', '2025-10-23 12:45:00'),
(9106, 18.00, 'Cash', '2025-10-23 20:05:00'),
(9107, 45.50, 'Credit Card', '2025-10-24 13:10:00'),
(9108, 34.99, 'App Payment', '2025-10-24 19:25:00'),
(9109, 21.50, 'Cash', '2025-10-25 13:35:00'),
(9110, 71.50, 'Credit Card', '2025-10-25 19:50:00'),
(9111, 32.00, 'App Payment', '2025-10-26 12:20:00'),
(9112, 20.99, 'Cash', '2025-10-26 20:20:00'),
(9113, 50.50, 'Credit Card', '2025-10-27 13:05:00'),
(9114, 41.50, 'App Payment', '2025-10-27 18:45:00'),
(9115, 26.50, 'Cash', '2025-10-28 13:00:00'),
(9116, 65.00, 'Credit Card', '2025-10-28 19:30:00'),
(9117, 35.50, 'App Payment', '2025-10-29 13:15:00'),
(9118, 17.00, 'Cash', '2025-10-29 20:00:00'),
(9119, 44.00, 'Credit Card', '2025-10-30 12:35:00'),
(9120, 29.99, 'App Payment', '2025-10-30 19:10:00'),
(9121, 23.00, 'Cash', '2025-10-31 13:45:00'),
(9122, 58.50, 'Credit Card', '2025-10-31 20:35:00'),
(9123, 37.50, 'App Payment', '2025-11-01 12:50:00'),
(9124, 15.50, 'Cash', '2025-11-01 19:20:00'),
(9125, 49.99, 'Credit Card', '2025-11-02 13:05:00'),
(9126, 54.00, 'App Payment', '2025-11-02 19:45:00'),
(9127, 28.00, 'Cash', '2025-11-03 12:55:00'),
(9128, 70.00, 'Credit Card', '2025-11-03 19:00:00'),
(9129, 33.99, 'App Payment', '2025-11-04 13:20:00'),
(9130, 19.50, 'Cash', '2025-11-04 20:05:00'),
(9131, 42.50, 'Credit Card', '2025-11-05 12:40:00'),
(9132, 48.99, 'App Payment', '2025-11-05 19:25:00'),
(9133, 24.50, 'Cash', '2025-11-06 13:05:00'),
(9134, 62.50, 'Credit Card', '2025-11-06 19:50:00'),
(9135, 36.00, 'App Payment', '2025-11-07 13:00:00'),
(9136, 18.50, 'Cash', '2025-11-07 20:15:00'),
(9137, 45.99, 'Credit Card', '2025-11-08 13:25:00'),
(9138, 31.50, 'App Payment', '2025-11-08 18:35:00'),
(9139, 22.50, 'Cash', '2025-11-09 12:45:00'),
(9140, 57.00, 'Credit Card', '2025-11-09 19:40:00'),
(9141, 40.50, 'App Payment', '2025-11-10 13:10:00'),
(9142, 16.00, 'Cash', '2025-11-10 20:30:00'),
(9143, 47.99, 'Credit Card', '2025-11-11 12:30:00'),
(9144, 50.99, 'App Payment', '2025-11-11 19:15:00'),
(9145, 25.50, 'Cash', '2025-11-12 13:20:00'),
(9146, 68.50, 'Credit Card', '2025-11-12 19:55:00'),
(9147, 34.50, 'App Payment', '2025-11-13 12:55:00'),
(9148, 20.00, 'Cash', '2025-11-13 18:50:00'),
(9149, 43.00, 'Credit Card', '2025-11-14 13:05:00'),
(9150, 30.99, 'App Payment', '2025-11-14 19:35:00'),
(9151, 24.00, 'Cash', '2025-11-15 13:30:00'),
(9152, 59.00, 'Credit Card', '2025-11-15 20:10:00'),
(9153, 38.99, 'App Payment', '2025-11-16 12:45:00'),
(9154, 17.50, 'Cash', '2025-11-16 19:50:00'),
(9155, 46.50, 'Credit Card', '2025-11-17 13:15:00'),
(9156, 52.50, 'App Payment', '2025-11-17 19:00:00'),
(9157, 26.00, 'Cash', '2025-11-18 12:25:00'),
(9158, 61.50, 'Credit Card', '2025-11-18 19:25:00'),
(9159, 32.99, 'App Payment', '2025-11-19 13:10:00'),
(9160, 18.50, 'Cash', '2025-11-19 20:05:00'),
(9161, 40.00, 'Credit Card', '2025-11-20 13:00:00'),
(9162, 49.50, 'App Payment', '2025-11-20 19:20:00'),
(9163, 21.00, 'Cash', '2025-11-21 13:35:00'),
(9164, 64.99, 'Credit Card', '2025-11-21 20:30:00'),
(9165, 35.00, 'App Payment', '2025-11-22 12:50:00'),
(9166, 19.99, 'Cash', '2025-11-22 19:45:00'),
(9167, 48.50, 'Credit Card', '2025-11-23 13:15:00'),
(9168, 51.50, 'App Payment', '2025-11-23 18:35:00'),
(9169, 27.50, 'Cash', '2025-11-24 12:55:00'),
(9170, 69.50, 'Credit Card', '2025-11-24 20:00:00'),
(9171, 33.00, 'App Payment', '2025-11-25 13:05:00'),
(9172, 16.50, 'Cash', '2025-11-25 19:15:00'),
(9173, 44.99, 'Credit Card', '2025-11-26 12:40:00'),
(9174, 47.99, 'App Payment', '2025-11-26 20:10:00'),
(9175, 22.50, 'Cash', '2025-11-27 13:20:00'),
(9176, 60.50, 'Credit Card', '2025-11-27 18:45:00'),
(9177, 39.50, 'App Payment', '2025-11-28 13:00:00'),
(9178, 18.00, 'Cash', '2025-11-28 19:35:00'),
(9179, 53.00, 'Credit Card', '2025-11-29 13:05:00'),
(9180, 55.50, 'App Payment', '2025-11-29 19:50:00'),
(9181, 29.99, 'Cash', '2025-11-30 12:25:00'),
(9182, 66.00, 'Credit Card', '2025-11-30 19:20:00'),
(9183, 10.99, 'Cash', '2025-11-01 08:35:00'),
(9184, 7.00, 'Credit Card', '2025-11-02 09:05:00'),
(9185, 14.50, 'Cash', '2025-11-03 08:50:00'),
(9186, 8.50, 'Credit Card', '2025-11-04 09:15:00'),
(9187, 12.00, 'Cash', '2025-11-05 08:40:00'),
(9188, 9.50, 'Credit Card', '2025-11-06 09:10:00'),
(9189, 16.00, 'Cash', '2025-11-07 08:55:00'),
(9190, 10.50, 'Credit Card', '2025-11-08 09:20:00'),
(9191, 11.50, 'Cash', '2025-11-09 08:45:00'),
(9192, 7.99, 'Credit Card', '2025-11-10 09:25:00'),
(9193, 13.50, 'Cash', '2025-11-11 09:00:00'),
(9194, 8.00, 'Credit Card', '2025-11-12 09:05:00'),
(9195, 15.00, 'Cash', '2025-11-13 08:35:00'),
(9196, 9.00, 'Credit Card', '2025-11-14 09:10:00'),
(9197, 12.50, 'Cash', '2025-11-15 08:50:00'),
(9198, 10.00, 'Credit Card', '2025-11-16 09:15:00'),
(9199, 17.00, 'Cash', '2025-11-17 08:55:00'),
(9200, 11.00, 'Credit Card', '2025-11-18 09:20:00'),
(9201, 14.00, 'Cash', '2025-11-19 08:45:00'),
(9202, 8.99, 'Credit Card', '2025-11-20 09:25:00'),
(9203, 15.50, 'Cash', '2025-11-21 09:00:00'),
(9204, 9.50, 'Credit Card', '2025-11-22 09:05:00'),
(9205, 13.99, 'Cash', '2025-11-23 08:35:00'),
(9206, 7.50, 'Credit Card', '2025-11-24 09:10:00'),
(9207, 11.00, 'Cash', '2025-11-25 08:50:00'),
(9208, 10.99, 'Credit Card', '2025-11-26 09:15:00'),
(9209, 16.50, 'Cash', '2025-11-27 08:55:00'),
(9210, 12.00, 'Credit Card', '2025-11-28 09:20:00'),
(9211, 14.99, 'Cash', '2025-11-29 08:45:00'),
(9212, 8.99, 'Credit Card', '2025-11-30 09:25:00'),
(9213, 40.00, 'Credit Card', '2025-09-02 20:03:00'),
(9214, 32.50, 'Cash', '2025-09-05 13:05:00'),
(9215, 25.00, 'Credit Card', '2025-09-08 19:05:00'),
(9216, 45.00, 'App Payment', '2025-09-12 13:35:00'),
(9217, 50.00, 'Credit Card', '2025-09-15 19:55:00'),
(9218, 22.00, 'Cash', '2025-09-18 12:45:00'),
(9219, 55.00, 'App Payment', '2025-09-22 19:05:00'),
(9220, 38.50, 'Credit Card', '2025-09-25 13:25:00'),
(9221, 30.00, 'Cash', '2025-09-28 19:35:00'),
(9222, 42.00, 'App Payment', '2025-10-01 13:50:00'),
(9223, 52.50, 'Credit Card', '2025-10-04 19:05:00'),
(9224, 27.00, 'Cash', '2025-10-07 12:55:00'),
(9225, 48.00, 'App Payment', '2025-10-10 19:35:00'),
(9226, 35.00, 'Credit Card', '2025-10-14 13:25:00'),
(9227, 24.50, 'Cash', '2025-10-17 19:05:00'),
(9228, 50.00, 'App Payment', '2025-10-21 12:50:00'),
(9229, 40.50, 'Credit Card', '2025-10-24 19:15:00'),
(9230, 31.50, 'Cash', '2025-10-28 13:05:00'),
(9231, 44.50, 'App Payment', '2025-10-31 19:05:00'),
(9232, 36.50, 'Credit Card', '2025-11-03 13:35:00'),
(9233, 29.00, 'Cash', '2025-11-06 19:55:00'),
(9234, 55.00, 'App Payment', '2025-11-10 12:45:00'),
(9235, 58.00, 'Credit Card', '2025-11-13 19:35:00'),
(9236, 23.50, 'Cash', '2025-11-17 13:05:00'),
(9237, 46.00, 'App Payment', '2025-11-20 19:05:00'),
(9238, 39.99, 'Credit Card', '2025-11-24 13:15:00'),
(9239, 34.00, 'Cash', '2025-11-27 19:55:00'),
(9240, 51.00, 'App Payment', '2025-11-30 13:05:00'),
(9241, 45.00, 'Credit Card', '2025-11-28 19:35:00'),
(9242, 37.99, 'App Payment', '2025-11-28 20:05:00'),
(9243, 28.50, 'Cash', '2025-11-29 12:50:00'),
(9244, 50.00, 'Credit Card', '2025-11-29 19:05:00'),
(9245, 21.99, 'App Payment', '2025-11-30 13:35:00'),
(9246, 44.99, 'Credit Card', '2025-11-30 19:05:00'),
(9247, 32.50, 'App Payment', '2025-11-30 19:18:00'),
(9248, 18.99, 'Cash', '2025-11-30 19:48:00'),
(9249, 60.00, 'Credit Card', '2025-11-30 20:03:00'),
(9250, 35.99, 'App Payment', '2025-11-30 20:18:00');
SET IDENTITY_INSERT Payment OFF;

SET IDENTITY_INSERT OrderPayment ON;
INSERT INTO OrderPayment (order_payment_id, order_id, payment_id) VALUES
(10001, 8001, 9001), (10002, 8002, 9002), (10003, 8003, 9003), (10004, 8004, 9004), (10005, 8005, 9005),
(10006, 8006, 9006), (10007, 8007, 9007), (10008, 8008, 9008), (10009, 8009, 9009), (10010, 8010, 9010),
(10011, 8011, 9011), (10012, 8012, 9012), (10013, 8013, 9013), (10014, 8014, 9014), (10015, 8015, 9015),
(10016, 8016, 9016), (10017, 8017, 9017), (10018, 8018, 9018), (10019, 8019, 9019), (10020, 8020, 9020),
(10021, 8021, 9021), (10022, 8022, 9022), (10023, 8023, 9023), (10024, 8024, 9024), (10025, 8025, 9025),
(10026, 8026, 9026), (10027, 8027, 9027), (10028, 8028, 9028), (10029, 8029, 9029), (10030, 8030, 9030),
(10031, 8031, 9031), (10032, 8032, 9032), (10033, 8033, 9033), (10034, 8034, 9034), (10035, 8035, 9035),
(10036, 8036, 9036), (10037, 8037, 9037), (10038, 8038, 9038), (10039, 8039, 9039), (10040, 8040, 9040),
(10041, 8041, 9041), (10042, 8042, 9042), (10043, 8043, 9043), (10044, 8044, 9044), (10045, 8045, 9045),
(10046, 8046, 9046), (10047, 8047, 9047), (10048, 8048, 9048), (10049, 8049, 9049), (10050, 8050, 9050),
(10051, 8051, 9051), (10052, 8052, 9052), (10053, 8053, 9053), (10054, 8054, 9054), (10055, 8055, 9055),
(10056, 8056, 9056), (10057, 8057, 9057), (10058, 8058, 9058), (10059, 8059, 9059), (10060, 8060, 9060),
(10061, 8061, 9061), (10062, 8062, 9062), (10063, 8063, 9063), (10064, 8064, 9064), (10065, 8065, 9065),
(10066, 8066, 9066), (10067, 8067, 9067), (10068, 8068, 9068), (10069, 8069, 9069), (10070, 8070, 9070),
(10071, 8071, 9071), (10072, 8072, 9072), (10073, 8073, 9073), (10074, 8074, 9074), (10075, 8075, 9075),
(10076, 8076, 9076), (10077, 8077, 9077), (10078, 8078, 9078), (10079, 8079, 9079), (10080, 8080, 9080),
(10081, 8081, 9081), (10082, 8082, 9082), (10083, 8083, 9083), (10084, 8084, 9084), (10085, 8085, 9085),
(10086, 8086, 9086), (10087, 8087, 9087), (10088, 8088, 9088), (10089, 8089, 9089), (10090, 8090, 9090),
(10091, 8091, 9091), (10092, 8092, 9092), (10093, 8093, 9093), (10094, 8094, 9094), (10095, 8095, 9095),
(10096, 8096, 9096), (10097, 8097, 9097), (10098, 8098, 9098), (10099, 8099, 9099), (10100, 8100, 9100),
(10101, 8101, 9101), (10102, 8102, 9102), (10103, 8103, 9103), (10104, 8104, 9104), (10105, 8105, 9105),
(10106, 8106, 9106), (10107, 8107, 9107), (10108, 8108, 9108), (10109, 8109, 9109), (10110, 8110, 9110),
(10111, 8111, 9111), (10112, 8112, 9112), (10113, 8113, 9113), (10114, 8114, 9114), (10115, 8115, 9115),
(10116, 8116, 9116), (10117, 8117, 9117), (10118, 8118, 9118), (10119, 8119, 9119), (10120, 8120, 9120),
(10121, 8121, 9121), (10122, 8122, 9122), (10123, 8123, 9123), (10124, 8124, 9124), (10125, 8125, 9125),
(10126, 8126, 9126), (10127, 8127, 9127), (10128, 8128, 9128), (10129, 8129, 9129), (10130, 8130, 9130),
(10131, 8131, 9131), (10132, 8132, 9132), (10133, 8133, 9133), (10134, 8134, 9134), (10135, 8135, 9135),
(10136, 8136, 9136), (10137, 8137, 9137), (10138, 8138, 9138), (10139, 8139, 9139), (10140, 8140, 9140),
(10141, 8141, 9141), (10142, 8142, 9142), (10143, 8143, 9143), (10144, 8144, 9144), (10145, 8145, 9145),
(10146, 8146, 9146), (10147, 8147, 9147), (10148, 8148, 9148), (10149, 8149, 9149), (10150, 8150, 9150),
(10151, 8151, 9151), (10152, 8152, 9152), (10153, 8153, 9153), (10154, 8154, 9154), (10155, 8155, 9155),
(10156, 8156, 9156), (10157, 8157, 9157), (10158, 8158, 9158), (10159, 8159, 9159), (10160, 8160, 9160),
(10161, 8161, 9161), (10162, 8162, 9162), (10163, 8163, 9163), (10164, 8164, 9164), (10165, 8165, 9165),
(10166, 8166, 9166), (10167, 8167, 9167), (10168, 8168, 9168), (10169, 8169, 9169), (10170, 8170, 9170),
(10171, 8171, 9171), (10172, 8172, 9172), (10173, 8173, 9173), (10174, 8174, 9174), (10175, 8175, 9175),
(10176, 8176, 9176), (10177, 8177, 9177), (10178, 8178, 9178), (10179, 8179, 9179), (10180, 8180, 9180),
(10181, 8181, 9181), (10182, 8182, 9182), (10183, 8183, 9183), (10184, 8184, 9184), (10185, 8185, 9185),
(10186, 8186, 9186), (10187, 8187, 9187), (10188, 8188, 9188), (10189, 8189, 9189), (10190, 8190, 9190),
(10191, 8191, 9191), (10192, 8192, 9192), (10193, 8193, 9193), (10194, 8194, 9194), (10195, 8195, 9195),
(10196, 8196, 9196), (10197, 8197, 9197), (10198, 8198, 9198), (10199, 8199, 9199), (10200, 8200, 9200),
(10201, 8201, 9201), (10202, 8202, 9202), (10203, 8203, 9203), (10204, 8204, 9204), (10205, 8205, 9205),
(10206, 8206, 9206), (10207, 8207, 9207), (10208, 8208, 9208), (10209, 8209, 9209), (10210, 8210, 9210),
(10211, 8211, 9211), (10212, 8212, 9212), (10213, 8213, 9213), (10214, 8214, 9214), (10215, 8215, 9215),
(10216, 8216, 9216), (10217, 8217, 9217), (10218, 8218, 9218), (10219, 8219, 9219), (10220, 8220, 9220),
(10221, 8221, 9221), (10222, 8222, 9222), (10223, 8223, 9223), (10224, 8224, 9224), (10225, 8225, 9225),
(10226, 8226, 9226), (10227, 8227, 9227), (10228, 8228, 9228), (10229, 8229, 9229), (10230, 8230, 9230),
(10231, 8231, 9231), (10232, 8232, 9232), (10233, 8233, 9233), (10234, 8234, 9234), (10235, 8235, 9235),
(10236, 8236, 9236), (10237, 8237, 9237), (10238, 8238, 9238), (10239, 8239, 9239), (10240, 8240, 9240),
(10241, 8241, 9241), (10242, 8242, 9242), (10243, 8243, 9243), (10244, 8244, 9244), (10245, 8245, 9245),
(10246, 8246, 9246), (10247, 8247, 9247), (10248, 8248, 9248), (10249, 8249, 9249), (10250, 8250, 9250);
SET IDENTITY_INSERT OrderPayment OFF;

SET IDENTITY_INSERT OrderItem ON;
INSERT INTO OrderItem (order_item_id, order_id, food_item_id, quantity, price_at_time) VALUES
(11001, 8001, 101, 1, 12.99), (11002, 8001, 116, 1, 16.50), (11003, 8001, 120, 3, 3.00),
(11004, 8002, 102, 1, 15.50), (11005, 8002, 119, 2, 5.00),
(11006, 8003, 104, 1, 15.99),
(11007, 8004, 117, 1, 24.99), (11008, 8004, 110, 1, 19.99), (11009, 8004, 111, 2, 3.26),
(11010, 8005, 113, 2, 9.50), (11011, 8005, 125, 1, 17.00), (11012, 8005, 127, 2, 2.00),
(11013, 8006, 131, 1, 15.00), (11014, 8006, 123, 1, 3.00),
(11015, 8007, 122, 1, 10.00), (11016, 8007, 136, 1, 11.99), (11017, 8007, 114, 1, 6.01),
(11018, 8008, 128, 2, 26.00), (11019, 8008, 129, 2, 5.49),
(11020, 8009, 132, 1, 11.99), (11021, 8009, 103, 1, 11.00),
(11022, 8010, 101, 1, 12.99),
(11023, 8011, 102, 1, 15.50), (11024, 8011, 105, 4, 5.00), (11025, 8011, 108, 2, 2.50),
(11026, 8012, 117, 2, 24.99),
(11027, 8013, 124, 2, 8.99),
(11028, 8014, 110, 2, 19.99), (11029, 8014, 118, 1, 22.00), (11030, 8014, 111, 2, 4.51), (11031, 8014, 130, 2, 9.00),
(11032, 8015, 113, 1, 9.50), (11033, 8015, 120, 4, 3.00), (11034, 8015, 107, 2, 3.00),
(11035, 8016, 122, 1, 10.00), (11036, 8016, 121, 2, 4.75),
(11037, 8017, 101, 2, 12.99), (11038, 8017, 137, 2, 4.01), (11039, 8017, 129, 2, 4.50),
(11040, 8018, 116, 1, 16.50), (11041, 8018, 119, 2, 5.00), (11042, 8018, 127, 1, 2.00),
(11043, 8019, 104, 1, 14.75),
(11044, 8020, 102, 2, 15.50), (11045, 8020, 131, 1, 15.00), (11046, 8020, 106, 1, 8.50),
(11047, 8021, 132, 2, 11.99), (11048, 8021, 120, 1, 3.01),
(11049, 8022, 101, 1, 12.99),
(11050, 8023, 103, 2, 10.99), (11051, 8023, 111, 2, 5.01),
(11052, 8024, 117, 1, 24.99), (11053, 8024, 118, 1, 16.51),
(11054, 8025, 124, 2, 8.99), (11055, 8025, 127, 2, 2.51),
(11056, 8026, 128, 2, 26.00), (11057, 8026, 109, 2, 8.00), (11058, 8026, 140, 1, 9.50),
(11059, 8027, 113, 2, 9.50), (11060, 8027, 127, 2, 2.00), (11061, 8027, 107, 3, 2.99),
(11062, 8028, 136, 1, 11.99), (11063, 8028, 123, 1, 4.51),
(11064, 8029, 101, 2, 12.99), (11065, 8029, 119, 2, 5.26),
(11066, 8030, 116, 2, 16.50), (11067, 8030, 120, 4, 2.50),
(11068, 8031, 104, 1, 14.75), (11069, 8031, 134, 3, 3.08),
(11070, 8032, 102, 2, 15.50), (11071, 8032, 138, 1, 16.50), (11072, 8032, 129, 1, 3.00),
(11073, 8033, 132, 1, 11.99), (11074, 8033, 103, 1, 10.51), (11075, 8033, 127, 3, 3.00),
(11076, 8034, 105, 3, 5.00),
(11077, 8035, 117, 1, 24.99), (11078, 8035, 129, 2, 5.00), (11079, 8035, 111, 2, 5.00),
(11080, 8036, 110, 1, 19.99), (11081, 8036, 107, 3, 2.67),
(11082, 8037, 124, 2, 8.99), (11083, 8037, 120, 1, 3.52),
(11084, 8038, 128, 1, 26.00), (11085, 8038, 131, 2, 16.00),
(11086, 8039, 113, 2, 9.50), (11087, 8039, 120, 5, 3.00), (11088, 8039, 127, 1, 2.49),
(11089, 8040, 101, 1, 12.99), (11090, 8040, 108, 1, 2.01),
(11091, 8041, 102, 1, 15.50), (11092, 8041, 125, 1, 17.00), (11093, 8041, 112, 1, 8.00),
(11094, 8042, 117, 1, 24.99), (11095, 8042, 118, 1, 22.00), (11096, 8042, 107, 1, 3.01),
(11097, 8043, 136, 2, 11.99),
(11098, 8044, 128, 2, 26.00), (11099, 8044, 111, 2, 4.50), (11100, 8044, 106, 1, 4.50),
(11101, 8045, 132, 2, 11.99), (11102, 8045, 120, 2, 3.51),
(11103, 8046, 104, 1, 14.75), (11104, 8046, 127, 1, 2.25),
(11105, 8047, 103, 2, 10.99), (11106, 8047, 138, 1, 16.50), (11107, 8047, 130, 1, 9.52),
(11108, 8048, 116, 2, 16.50), (11109, 8048, 107, 1, 1.50),
(11110, 8049, 124, 2, 8.99), (11111, 8049, 134, 2, 2.51),
(11112, 8050, 117, 2, 24.99), (11113, 8050, 110, 1, 19.99), (11114, 8050, 140, 2, 1.01),
(11115, 8051, 113, 2, 9.50), (11116, 8051, 127, 3, 2.50), (11117, 8051, 120, 2, 3.50),
(11118, 8052, 101, 1, 12.99), (11119, 8052, 121, 2, 3.01),
(11120, 8053, 102, 2, 15.50), (11121, 8053, 131, 2, 15.00), (11122, 8053, 112, 1, 9.50),
(11123, 8054, 125, 2, 17.00), (11124, 8054, 120, 2, 3.49),
(11125, 8055, 136, 2, 11.99), (11126, 8055, 123, 1, 2.02),
(11127, 8056, 128, 2, 26.00), (11128, 8056, 129, 1, 8.00),
(11129, 8057, 132, 2, 11.99), (11130, 8057, 107, 3, 4.01),
(11131, 8058, 104, 1, 14.75), (11132, 8058, 135, 1, 6.24),
(11133, 8059, 103, 2, 10.99), (11134, 8059, 137, 2, 4.01), (11135, 8059, 111, 2, 6.50),
(11136, 8060, 116, 2, 16.50), (11137, 8060, 118, 1, 17.00),
(11138, 8061, 101, 2, 12.99), (11139, 8061, 127, 1, 3.01),
(11140, 8062, 117, 2, 24.99), (11141, 8062, 110, 2, 19.99), (11142, 8062, 106, 1, 2.53),
(11143, 8063, 132, 1, 11.99), (11144, 8063, 120, 5, 4.60),
(11145, 8064, 124, 1, 8.99), (11146, 8064, 123, 1, 9.51),
(11147, 8065, 102, 1, 15.50), (11148, 8065, 138, 1, 16.50), (11149, 8065, 129, 2, 5.00),
(11150, 8066, 125, 2, 17.00), (11151, 8066, 119, 2, 5.25), (11152, 8066, 127, 1, 3.00),
(11153, 8067, 136, 1, 11.99), (11154, 8067, 108, 3, 3.00),
(11155, 8068, 128, 2, 26.00), (11156, 8068, 131, 2, 15.00),
(11157, 8069, 113, 2, 9.50), (11158, 8069, 120, 5, 4.10),
(11159, 8070, 101, 1, 12.99), (11160, 8070, 127, 1, 3.01),
(11161, 8071, 103, 2, 10.99), (11162, 8071, 117, 1, 24.52),
(11163, 8072, 116, 2, 16.50), (11164, 8072, 107, 1, 0.99),
(11165, 8073, 104, 1, 14.75), (11166, 8073, 134, 4, 2.50),
(11167, 8074, 110, 2, 19.99), (11168, 8074, 128, 1, 19.52),
(11169, 8075, 132, 2, 11.99), (11170, 8075, 127, 1, 3.52),
(11171, 8076, 139, 1, 14.99),
(11172, 8077, 102, 1, 15.50), (11173, 8077, 103, 1, 10.99), (11174, 8077, 129, 2, 6.25),
(11175, 8078, 125, 2, 17.00), (11176, 8078, 107, 1, 1.50), (11177, 8078, 120, 2, 3.50),
(11178, 8079, 136, 2, 11.50),
(11179, 8080, 128, 2, 26.00), (11180, 8080, 117, 1, 15.50),
(11181, 8081, 113, 1, 9.50), (11182, 8081, 120, 5, 4.10), (11183, 8081, 127, 1, 0.50),
(11184, 8082, 101, 1, 12.99), (11185, 8082, 123, 1, 4.51),
(11186, 8083, 102, 2, 15.50), (11187, 8083, 138, 1, 16.50), (11188, 8083, 112, 1, 1.50),
(11189, 8084, 117, 2, 24.99), (11190, 8084, 106, 1, 2.01),
(11191, 8085, 124, 2, 8.99), (11192, 8085, 139, 1, 11.52),
(11193, 8086, 128, 2, 26.00), (11194, 8086, 131, 1, 12.00),
(11195, 8087, 132, 1, 11.99), (11196, 8087, 107, 5, 4.90),
(11197, 8088, 104, 1, 14.75), (11198, 8088, 127, 1, 0.75),
(11199, 8089, 103, 2, 10.99), (11200, 8089, 119, 2, 6.01), (11201, 8089, 129, 2, 5.00),
(11202, 8090, 116, 1, 16.50), (11203, 8090, 120, 4, 3.12),
(11204, 8091, 105, 4, 5.50),
(11205, 8092, 102, 2, 15.50), (11206, 8092, 138, 1, 16.50), (11207, 8092, 106, 1, 9.00),
(11208, 8093, 132, 1, 11.99), (11209, 8093, 125, 1, 17.01), (11210, 8093, 127, 1, 2.00),
(11211, 8094, 136, 1, 11.99), (11212, 8094, 123, 1, 7.51),
(11213, 8095, 117, 1, 24.99), (11214, 8095, 110, 1, 19.99), (11215, 8095, 107, 2, 1.01),
(11216, 8096, 118, 1, 22.00), (11217, 8096, 120, 5, 3.10),
(11218, 8097, 124, 2, 8.99), (11219, 8097, 134, 2, 3.26),
(11220, 8098, 128, 2, 26.00), (11221, 8098, 131, 2, 8.50),
(11222, 8099, 113, 1, 9.50), (11223, 8099, 103, 2, 10.99), (11224, 8099, 127, 1, 2.51),
(11225, 8100, 104, 1, 14.75), (11226, 8100, 107, 1, 1.75),
(11227, 8101, 102, 1, 15.50), (11228, 8101, 125, 1, 17.00), (11229, 8101, 112, 1, 7.50),
(11230, 8102, 117, 1, 24.99), (11231, 8102, 118, 1, 22.00), (11232, 8102, 120, 2, 3.26),
(11233, 8103, 136, 2, 11.99),
(11234, 8104, 128, 2, 26.00), (11235, 8104, 111, 2, 4.99),
(11236, 8105, 132, 2, 11.99), (11237, 8105, 120, 4, 3.26),
(11238, 8106, 104, 1, 14.75), (11239, 8106, 127, 1, 3.25),
(11240, 8107, 103, 2, 10.99), (11241, 8107, 138, 1, 16.50), (11242, 8107, 129, 2, 3.51),
(11243, 8108, 116, 2, 16.50), (11244, 8108, 120, 1, 1.99),
(11245, 8109, 124, 2, 8.99), (11246, 8109, 123, 1, 3.52),
(11247, 8110, 117, 2, 24.99), (11248, 8110, 110, 1, 19.99), (11249, 8110, 140, 2, 1.51),
(11250, 8111, 113, 2, 9.50), (11251, 8111, 120, 4, 3.25), (11252, 8111, 107, 2, 1.00),
(11253, 8112, 101, 1, 12.99), (11254, 8112, 121, 2, 4.00),
(11255, 8113, 102, 2, 15.50), (11256, 8113, 131, 2, 15.00), (11257, 8113, 112, 1, 4.50),
(11258, 8114, 125, 2, 17.00), (11259, 8114, 127, 2, 3.75),
(11260, 8115, 136, 2, 11.99), (11261, 8115, 123, 1, 2.52),
(11262, 8116, 128, 2, 26.00), (11263, 8116, 129, 1, 13.00),
(11264, 8117, 132, 2, 11.99), (11265, 8117, 120, 3, 3.17),
(11266, 8118, 104, 1, 14.75), (11267, 8118, 108, 1, 2.25),
(11268, 8119, 103, 2, 10.99), (11269, 8119, 137, 2, 5.01), (11270, 8119, 111, 2, 6.00),
(11271, 8120, 116, 1, 16.50), (11272, 8120, 107, 4, 3.37),
(11273, 8121, 101, 2, 12.99),
(11274, 8122, 117, 2, 24.99), (11275, 8122, 118, 1, 8.52),
(11276, 8123, 132, 1, 11.99), (11277, 8123, 113, 1, 9.50), (11278, 8123, 120, 5, 3.20),
(11279, 8124, 104, 1, 14.75), (11280, 8124, 127, 1, 0.75),
(11281, 8125, 102, 2, 15.50), (11282, 8125, 138, 1, 16.50), (11283, 8125, 106, 1, 2.49),
(11284, 8126, 125, 2, 17.00), (11285, 8126, 111, 2, 4.00), (11286, 8126, 107, 2, 3.00),
(11287, 8127, 136, 2, 11.99), (11288, 8127, 123, 1, 4.02),
(11289, 8128, 128, 2, 26.00), (11290, 8128, 131, 2, 9.00),
(11291, 8129, 113, 2, 9.50), (11292, 8129, 120, 4, 3.75), (11293, 8129, 127, 1, 1.99),
(11294, 8130, 101, 1, 12.99), (11295, 8130, 108, 1, 6.51),
(11296, 8131, 103, 2, 10.99), (11297, 8131, 129, 2, 5.26),
(11298, 8132, 116, 2, 16.50), (11299, 8132, 107, 1, 1.99),
(11300, 8133, 104, 1, 14.75), (11301, 8133, 134, 4, 2.44),
(11302, 8134, 117, 1, 24.99), (11303, 8134, 110, 1, 19.99), (11304, 8134, 111, 2, 8.76),
(11305, 8135, 132, 2, 11.99), (11306, 8135, 127, 2, 4.01),
(11307, 8136, 139, 1, 14.00), (11308, 8136, 123, 1, 4.50),
(11309, 8137, 102, 1, 15.50), (11310, 8137, 125, 1, 17.00), (11311, 8137, 140, 1, 13.49),
(11312, 8138, 118, 1, 22.00), (11313, 8138, 120, 3, 3.17),
(11314, 8139, 124, 2, 8.99), (11315, 8139, 121, 1, 4.52),
(11316, 8140, 128, 2, 26.00), (11317, 8140, 130, 1, 5.00),
(11318, 8141, 113, 2, 9.50), (11319, 8141, 120, 4, 3.00), (11320, 8141, 107, 3, 2.84),
(11321, 8142, 101, 1, 12.99), (11322, 8142, 127, 1, 3.01),
(11323, 8143, 103, 2, 10.99), (11324, 8143, 138, 1, 16.50), (11325, 8143, 129, 2, 4.76),
(11326, 8144, 116, 2, 16.50), (11327, 8144, 118, 1, 17.99),
(11328, 8145, 136, 2, 11.99), (11329, 8145, 127, 2, 0.76),
(11330, 8146, 128, 2, 26.00), (11331, 8146, 131, 2, 8.25),
(11332, 8147, 132, 1, 11.99), (11333, 8147, 120, 3, 7.50),
(11334, 8148, 104, 1, 14.75), (11335, 8148, 121, 1, 5.25),
(11336, 8149, 102, 1, 15.50), (11337, 8149, 125, 1, 17.00), (11338, 8149, 112, 1, 10.50),
(11339, 8150, 117, 1, 24.99), (11340, 8150, 120, 2, 3.00),
(11341, 8151, 124, 2, 8.99), (11342, 8151, 134, 2, 3.01),
(11343, 8152, 128, 1, 26.00), (11344, 8152, 110, 1, 19.99), (11345, 8152, 106, 1, 13.01),
(11346, 8153, 113, 2, 9.50), (11347, 8153, 103, 1, 10.99), (11348, 8153, 127, 1, 2.00),
(11349, 8154, 101, 1, 12.99), (11350, 8154, 107, 1, 4.51),
(11351, 8155, 102, 2, 15.50), (11352, 8155, 137, 2, 7.75),
(11353, 8156, 116, 2, 16.50), (11354, 8156, 120, 4, 4.75),
(11355, 8157, 136, 2, 11.99), (11356, 8157, 123, 1, 2.02),
(11357, 8158, 128, 2, 26.00), (11358, 8158, 129, 1, 9.50),
(11359, 8159, 132, 1, 11.99), (11360, 8159, 127, 4, 5.25), (11361, 8159, 120, 2, 0.50),
(11362, 8160, 104, 1, 14.75), (11363, 8160, 108, 1, 3.75),
(11364, 8161, 103, 2, 10.99), (11365, 8161, 111, 2, 5.01),
(11366, 8162, 117, 1, 24.99), (11367, 8162, 110, 1, 19.99), (11368, 8162, 127, 2, 2.26),
(11369, 8163, 124, 2, 8.99), (11370, 8163, 134, 1, 3.02),
(11371, 8164, 128, 2, 26.00), (11372, 8164, 138, 1, 16.50), (11373, 8164, 140, 2, 0.50),
(11374, 8165, 132, 2, 11.99), (11375, 8165, 107, 3, 3.68),
(11376, 8166, 101, 1, 12.99), (11377, 8166, 123, 1, 7.00),
(11378, 8167, 102, 2, 15.50), (11379, 8167, 131, 2, 8.75),
(11380, 8168, 125, 2, 17.00), (11381, 8168, 119, 2, 6.75), (11382, 8168, 120, 2, 3.50),
(11383, 8169, 136, 2, 11.99), (11384, 8169, 108, 1, 3.52),
(11385, 8170, 128, 2, 26.00), (11386, 8170, 129, 2, 8.75),
(11387, 8171, 113, 2, 9.50), (11388, 8171, 127, 3, 2.00), (11389, 8171, 120, 2, 3.00),
(11390, 8172, 104, 1, 14.75), (11391, 8172, 121, 1, 1.75),
(11392, 8173, 103, 2, 10.99), (11393, 8173, 111, 2, 5.01), (11394, 8173, 130, 1, 13.00),
(11395, 8174, 116, 2, 16.50), (11396, 8174, 107, 2, 4.25),
(11397, 8175, 124, 2, 8.99), (11398, 8175, 134, 1, 4.52),
(11399, 8176, 117, 1, 24.99), (11400, 8176, 110, 1, 19.99), (11401, 8176, 129, 2, 7.76),
(11402, 8177, 132, 2, 11.99), (11403, 8177, 120, 5, 3.10),
(11404, 8178, 101, 1, 12.99), (11405, 8178, 127, 1, 5.01),
(11406, 8179, 102, 2, 15.50), (11407, 8179, 138, 1, 16.50), (11408, 8179, 140, 1, 5.50),
(11409, 8180, 125, 2, 17.00), (11410, 8180, 111, 2, 4.00), (11411, 8180, 107, 2, 3.50),
(11412, 8181, 136, 2, 11.99), (11413, 8181, 123, 1, 6.01),
(11414, 8182, 128, 2, 26.00), (11415, 8182, 131, 2, 7.00),
(11416, 8183, 108, 3, 2.50), (11417, 8183, 123, 1, 3.49),
(11418, 8184, 135, 1, 4.00), (11419, 8184, 108, 1, 3.00),
(11420, 8185, 108, 3, 2.50), (11421, 8185, 107, 2, 3.50),
(11422, 8186, 135, 2, 4.00), (11423, 8186, 121, 1, 0.50),
(11424, 8187, 121, 3, 4.00),
(11425, 8188, 108, 3, 2.50), (11426, 8188, 135, 1, 2.00),
(11427, 8189, 108, 4, 2.50), (11428, 8189, 107, 2, 3.00),
(11429, 8190, 135, 2, 4.00), (11430, 8190, 120, 1, 2.50),
(11431, 8191, 121, 3, 3.00), (11432, 8191, 107, 1, 2.50),
(11433, 8192, 108, 2, 2.50), (11434, 8192, 135, 1, 2.99),
(11435, 8193, 107, 3, 3.00), (11436, 8193, 135, 1, 4.50),
(11437, 8194, 121, 2, 4.00),
(11438, 8195, 108, 4, 2.50), (11439, 8195, 135, 2, 2.50),
(11440, 8196, 121, 3, 3.00),
(11441, 8197, 107, 3, 3.00), (11442, 8197, 121, 1, 3.50),
(11443, 8198, 108, 4, 2.50),
(11444, 8199, 135, 3, 4.00), (11445, 8199, 121, 2, 2.50),
(11446, 8200, 108, 4, 2.75),
(11447, 8201, 107, 3, 3.00), (11448, 8201, 135, 2, 2.50),
(11449, 8202, 121, 2, 3.00), (11450, 8202, 108, 1, 2.99),
(11451, 8203, 108, 4, 2.50), (11452, 8203, 135, 2, 2.75),
(11453, 8204, 121, 2, 3.00), (11454, 8204, 107, 1, 3.50),
(11455, 8205, 135, 3, 4.00), (11456, 8205, 108, 1, 1.99),
(11457, 8206, 107, 1, 3.00), (11458, 8206, 120, 1, 2.00),
(11459, 8207, 121, 2, 4.00), (11460, 8207, 108, 1, 3.00),
(11461, 8208, 135, 2, 4.00), (11462, 8208, 127, 1, 2.99),
(11463, 8209, 108, 4, 2.50), (11464, 8209, 135, 2, 3.25),
(11465, 8210, 121, 3, 4.00),
(11466, 8211, 107, 3, 3.00), (11467, 8211, 135, 1, 5.99),
(11468, 8212, 108, 2, 2.50), (11469, 8212, 121, 1, 3.99),
(11470, 8213, 116, 2, 16.50), (11471, 8213, 120, 2, 3.50),
(11472, 8214, 102, 1, 15.50), (11473, 8214, 129, 1, 17.00),
(11474, 8215, 101, 2, 12.50),
(11475, 8216, 117, 1, 24.99), (11476, 8216, 118, 1, 20.01),
(11477, 8217, 128, 2, 26.00), (11478, 8217, 106, 1, 8.00),
(11479, 8218, 104, 1, 14.75), (11480, 8218, 127, 1, 7.25),
(11481, 8219, 117, 1, 24.99), (11482, 8219, 110, 1, 19.99), (11483, 8219, 111, 2, 5.01),
(11484, 8220, 103, 2, 10.99), (11485, 8220, 119, 2, 4.26),
(11486, 8221, 136, 2, 11.99), (11487, 8221, 107, 2, 3.01),
(11488, 8222, 132, 1, 11.99), (11489, 8222, 120, 5, 6.00),
(11490, 8223, 102, 2, 15.50), (11491, 8223, 138, 1, 16.50), (11492, 8223, 129, 1, 5.00),
(11493, 8224, 101, 2, 12.99), (11494, 8224, 127, 1, 1.02),
(11495, 8225, 116, 2, 16.50), (11496, 8225, 120, 5, 3.00),
(11497, 8226, 103, 2, 10.99), (11498, 8226, 137, 2, 6.51),
(11499, 8227, 104, 1, 14.75), (11500, 8227, 139, 1, 9.75),
(11501, 8228, 117, 1, 24.99), (11502, 8228, 118, 1, 20.01), (11503, 8228, 127, 2, 2.50),
(11504, 8229, 128, 1, 26.00), (11505, 8229, 112, 1, 7.50), (11506, 8229, 130, 1, 7.00),
(11507, 8230, 113, 2, 9.50), (11508, 8230, 124, 2, 8.99), (11509, 8230, 123, 1, 4.02),
(11510, 8231, 132, 2, 11.99), (11511, 8231, 120, 5, 4.10),
(11512, 8232, 102, 1, 15.50), (11513, 8232, 138, 1, 16.50), (11514, 8232, 129, 1, 4.50),
(11515, 8233, 101, 2, 12.99), (11516, 8233, 127, 2, 1.51),
(11517, 8234, 117, 2, 24.99), (11518, 8234, 110, 1, 19.99), (11519, 8234, 106, 1, 0.03),
(11520, 8235, 128, 2, 26.00), (11521, 8235, 131, 2, 3.00),
(11522, 8236, 104, 1, 14.75), (11523, 8236, 120, 1, 8.75),
(11524, 8237, 116, 2, 16.50), (11525, 8237, 119, 2, 6.50),
(11526, 8238, 103, 2, 10.99), (11527, 8238, 137, 2, 9.01),
(11528, 8239, 136, 2, 11.99), (11529, 8239, 107, 3, 3.34),
(11530, 8240, 125, 2, 17.00), (11531, 8240, 111, 2, 8.50),
(11532, 8241, 102, 1, 15.50), (11533, 8241, 138, 1, 16.50), (11534, 8241, 129, 2, 6.50),
(11535, 8242, 116, 2, 16.50), (11536, 8242, 120, 1, 4.99),
(11537, 8243, 101, 2, 12.99), (11538, 8243, 127, 1, 2.52),
(11539, 8244, 128, 2, 26.00), (11540, 8244, 131, 1, 24.00),
(11541, 8245, 132, 1, 11.99), (11542, 8245, 120, 3, 3.34),
(11543, 8246, 103, 2, 10.99), (11544, 8246, 117, 1, 23.01),
(11545, 8247, 125, 1, 17.00), (11546, 8247, 127, 2, 3.50), (11547, 8247, 107, 1, 4.50),
(11548, 8248, 136, 1, 11.99), (11549, 8248, 108, 1, 7.00),
(11550, 8249, 128, 2, 26.00), (11551, 8249, 110, 1, 20.00), (11552, 8249, 106, 1, 14.00),
(11553, 8250, 132, 2, 11.99), (11554, 8250, 120, 4, 3.01);
-- (Remaining records 11555 to 11800 would be generated here to total 400 records)
SET IDENTITY_INSERT OrderItem OFF;

ALTER TABLE Payment
ADD order_id INT;
ALTER TABLE Payment
ADD CONSTRAINT FK_Payment_Orders
FOREIGN KEY (order_id)
REFERENCES [Order](order_id);
UPDATE p
SET p.order_id = o.order_id
FROM Payment p
JOIN [Order] o
  ON CAST(p.payment_date AS DATE) = CAST(o.order_date AS DATE);



ALTER TABLE FoodItem
ADD category_id INT;
ALTER TABLE FoodItem
ADD CONSTRAINT FK_FoodItem_Category
FOREIGN KEY (category_id) REFERENCES Category(category_id);



EXEC sp_helpconstraint 'Stock';
EXEC sp_helpindex 'Stock';
ALTER TABLE Stock
DROP CONSTRAINT FK_Stock_FoodItem;
DROP INDEX IX_Stock_food_item_id ON Stock;
ALTER TABLE Stock
ADD ingredient_id INT;
UPDATE s
SET ingredient_id = fii.ingredient_id
FROM Stock s
JOIN FoodItemIngredient fii
    ON s.food_item_id = fii.food_item_id;
ALTER TABLE Stock
DROP COLUMN food_item_id;
ALTER TABLE Stock
ADD CONSTRAINT FK_Stock_Ingredient
FOREIGN KEY (ingredient_id)
REFERENCES Ingredient(ingredient_id);
CREATE INDEX IX_Stock_ingredient_id
ON Stock(ingredient_id);
SELECT * FROM Stock;
EXEC sp_help 'Stock';

SET IDENTITY_INSERT Stock ON;
INSERT INTO Stock (stock_id, food_item_id, quantity_available, last_updated,ingredient_id) VALUES
(1, 101, 150.00, GETDATE(),1),
(2, 102, 200.00, GETDATE(),2), 
(3, 103, 180.00, GETDATE(),3), 
(4, 104, 175.00, GETDATE(),4), 
(5, 105, 300.00, GETDATE(),5), 
(6, 106, 120.00, GETDATE(),6), 
(7, 107, 500.00, GETDATE(),7),
(8, 108, 450.00, GETDATE(),8), 
(9, 109, 140.00, GETDATE(),9), 
(10, 110, 110.00, GETDATE(),10), 
(11, 111, 600.00, GETDATE(),11), 
(12, 112, 100.00, GETDATE(),12), 
(13, 113, 160.00, GETDATE(),13),
(14, 114, 250.00, GETDATE(),14), 
(15, 115, 130.00, GETDATE(),15), 
(16, 116, 190.00, GETDATE(),16),
(17, 117, 90.00, GETDATE(),17), 
(18, 118, 85.00, GETDATE(),18), 
(19, 119, 350.00, GETDATE(),19),
(20, 120, 400.00, GETDATE(),20),
(21, 121, 220.00, GETDATE(),21), 
(22, 122, 125.00, GETDATE(),22),
(23, 123, 550.00, GETDATE(),23), 
(24, 124, 170.00, GETDATE(),24), 
(25, 125, 210.00, GETDATE(),25), 
(26, 126, 155.00, GETDATE(),26),
(27, 127, 700.00, GETDATE(),27), 
(28, 128, 70.00, GETDATE(),28), 
(29, 129, 300.00, GETDATE(),29), 
(30, 130, 95.00, GETDATE(),30), 
(31, 131, 165.00, GETDATE(),31), 
(32, 132, 135.00, GETDATE(),32), 
(33, 133, 180.00, GETDATE(),33), 
(34, 134, 320.00, GETDATE(),34), 
(35, 135, 280.00, GETDATE(),35), 
(36, 136, 145.00, GETDATE(),36), 
(37, 137, 260.00, GETDATE(),37), 
(38, 138, 175.00, GETDATE(),38),
(39, 139, 105.00, GETDATE(),39), 
(40, 140, 115.00, GETDATE(),40);
SET IDENTITY_INSERT Stock OFF;

DELETE FROM InventoryLog;
ALTER TABLE InventoryLog
DROP COLUMN food_item_id;
DROP INDEX IX_InventoryLog_food_item_id
ON InventoryLog;
ALTER TABLE InventoryLog
DROP CONSTRAINT FK_Log_FoodItem;
ALTER TABLE InventoryLog
ADD CONSTRAINT FK_InventoryLog_Ingredient
FOREIGN KEY (ingredient_id)
REFERENCES Ingredient(ingredient_id);



INSERT INTO InventoryLog (user_id, action_type, quantity_change, timestamp,ingredient_id)
VALUES 
-- ADMIN & INVENTORY STAFF RESTOCKS (IDs: 1001, 1004, 1014)
(1001,  'RESTOCK', 50.00, '2026-01-01 08:30:00',1),   -- Admin restocks Cheeseburgers
(1002,  'RESTOCK', 30.00, '2026-01-01 08:45:00',2),   -- Inventory Johnson restocks Pizza
(1001,  'RESTOCK', 100.00, '2026-01-01 09:00:00',3),  -- Inventory Ian restocks Fries
(1001,  'RESTOCK', 144.00, '2026-01-01 09:15:00',4),  -- Admin restocks Diet Soda

-- MANAGER & WAITER SALES (IDs: 1002, 1005, 1011)
(1001,  'SALE', -5.00, '2026-01-01 12:30:00',5),      -- Manager Smith records Burger sales
(1001,  'SALE', -2.00, '2026-01-01 13:00:00',6),      -- Waiter Alice records Salad sales
(1002,  'SALE', -8.00, '2026-01-02 20:30:00',7),      -- Manager Smith records Ribs sales
(1001,  'SALE', -10.00, '2026-01-01 19:00:00',8),     -- Waiter Fiona records Spaghetti sales

-- CHEF WASTE & ADJUSTMENTS (IDs: 1003, 1010, 1016)
(1001,  'WASTE', -3.00, '2026-01-01 15:00:00',9),      -- Chef Gordon records Pizza waste
(1001,  'ADJUSTMENT', -1.00, '2026-01-02 10:00:00',10), -- Chef Ben adjusts Shrimp count
(1001,  'WASTE', -4.00, '2026-01-02 21:00:00',11),      -- Chef Maria records Nacho waste

-- ADDITIONAL RESTOCKS (IDs: 1001, 1009)
(1001,  'RESTOCK', 25.00, '2026-01-02 08:00:00',12),   -- Admin restocks Veggie Burgers
(1001,  'RESTOCK', 40.00, '2026-01-02 08:15:00',13),   -- Manager Emily restocks Veggie Pizza
(1001,  'RESTOCK', 15.00, '2026-01-02 22:00:00',14);   -- Admin restocks Lava Cake




use FoodManagementDB

select * from [User]
select * from Role;
select * from UserRole
select * from Stock
select * from InventoryLog
select * from [Order]
SELECT * FROM Payment;
select * from category;
select * from supplier;
select * from Unit;
select * from ingredient;
select * from foodItem;
select * from Purchase;
select * from PurchaseItem;
select * from FoodItemCategory;
select * from FoodItemIngredient;
select * from PurchaseItem; 
select * from OrderItem;
select * from OrderPayment;
select * from ItemUnit;






