import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AuthorAttributes {
  id: number;
  name: string;
  biography?: string;
  born_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthorCreationAttributes extends Optional<AuthorAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
  public id!: number;
  public name!: string;
  public biography?: string;
  public born_date?: Date;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255],
      },
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    born_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'authors',
    timestamps: true,
  }
);

export default Author;
