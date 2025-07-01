import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Author from './Author';

interface BookAttributes {
  id: number;
  title: string;
  description?: string;
  published_date?: Date;
  author_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public published_date?: Date;
  public author_id!: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Author,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
  }
);

// Define associations
Book.belongsTo(Author, {
  foreignKey: 'author_id',
  as: 'author',
});

Author.hasMany(Book, {
  foreignKey: 'author_id',
  as: 'books',
});

export default Book;
