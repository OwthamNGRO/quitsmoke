IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        ImageUrl NVARCHAR(2048) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ProductId INT NOT NULL,
        Status NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Orders_Products
            FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name = N'Nicotine Patch')
BEGIN
    INSERT INTO dbo.Products (Name, Price, ImageUrl)
    VALUES (
        N'Nicotine Patch',
        29.99,
        N'https://stquitsmokedev.blob.core.windows.net/product-images/patch.jpg'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name = N'Herbal Inhaler')
BEGIN
    INSERT INTO dbo.Products (Name, Price, ImageUrl)
    VALUES (
        N'Herbal Inhaler',
        14.99,
        N'https://stquitsmokedev.blob.core.windows.net/product-images/inhaler.jpg'
    );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE Name = N'CBT Journal')
BEGIN
    INSERT INTO dbo.Products (Name, Price, ImageUrl)
    VALUES (
        N'CBT Journal',
        19.99,
        N'https://stquitsmokedev.blob.core.windows.net/product-images/journal.jpg'
    );
END;
GO
