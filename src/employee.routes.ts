import * as express from 'express';
import * as mongodb from 'mongodb';
import {collections} from './database';

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// sending all employees data to client side
employeeRouter.get('/', async (_req,res) =>
{
    try 
    {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) 
    {
        console.error(error);
        res.status(500).send(error.message);        
    }
})

// send a single employee data to client side based on its ID
employeeRouter.get('/:id', async (req,res) =>
{
    try 
    {
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const employee = await collections.employees.findOne(query);
        if(employee)
        {
            res.status(200).send(employee);
        }
        else
        {
            console.error(`Failed to find an employee ID: ${req?.params?.id}`);
            res.status(404).send(`Failed to find an employee ID: ${req?.params?.id}`);
        }
    } 
    catch (error) 
    {
        console.error(error);
        res.status(404).send(`Failed to find an employee ID: ${req?.params?.id}`);       
    }
})

// updating an employee data with put request
employeeRouter.put('/:id', async (req,res) =>
{
    try 
    {
        const id = req?.params?.id;
        const employee = req?.body;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = collections.employees.updateOne(query,{$set: employee})

        if(result)
        {
            res.status(200).send(`updated an employee: ${id}`);
        }
        else if(!result)
        {
            console.error(`Failed to find an employee: ${id}`);
            res.status(404).send(`Failed to update an employee: ${id}`);
        }
        else
        {
            console.error(`Failed to find an employee: ${id}`);
            res.status(304).send(`Failed to find an employee: ${id}`);
        }
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send(error.message);        
    }
})

// deleting an employee data from the database
employeeRouter.delete('/:id', async (req,res) =>
{
    try 
    {
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.deleteOne(query);
        if(result && result.deletedCount)
        {
            console.log(`removed an employee ID: ${id}`);
            res.status(202).send(`removed an employee ID: ${id}`)
        }
        else if(!result)
        {
            console.error(`failed to remove an employee ID: ${id}`);
            res.status(400).send(`failed to remove an employee ID: ${id}`  );
        }
        else
        {
            console.error(`failed to remove an employee ID: ${id}`);
            res.status(404).send(`failed to remove an employee ID: ${id}`  );
        }
    } 
    catch (error) 
    {
        console.error(error);
        res.status(400).send(error.message);    
    }
})

// adding a new employee to the collection
employeeRouter.post('/', async (req,res)=>
    {
        try
        {
            const employee  =   req.body;
            const result =  await collections.employees.insertOne(employee);
            if(result.acknowledged)
            {
                res.status(201).send(`created new employee: ID ${result.insertedId}`);
            }
            else
            {
                res.status(500).send('Failed to create new employee');
            }
        }
        catch(error)
        {
            console.error(error);
            res.status(400).send(error.message);
        }
    })


