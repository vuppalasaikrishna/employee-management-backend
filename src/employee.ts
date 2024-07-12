import * as mongodb from 'mongodb';

export interface Employee
{
    name: string;
    position:   string;
    levels: 'junior' | 'mid' | 'senior';
    _id?:    mongodb.ObjectId;
}
