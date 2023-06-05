import express from 'express'
import BlogAuthorsModel from '../models/blogAuthorModel.js'

const authors = express.Router()

authors.get('/authors', async (req, res) => {
    try {
        const authors = await BlogAuthorsModel.find()
        res.status(200).send(authors)
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }
})

authors.get('/authors/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findOne({_id: id})
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} doesn't found`
            })
        }
        res.status(200).send(authorExists)
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }
})

authors.post('/authors', async (req, res) => {
    try {
        const authorExists = await BlogAuthorsModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        if (authorExists) {
            return res.status(409).send({
                message: 'existing author'
            })
        }
        const author = new BlogAuthorsModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthDate: req.body.birthDate,
            avatar: req.body.avatar
        })
        const newAuthor = await author.save()
        res.status(201).send({
            message: 'author created',
            payload: newAuthor
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })      
    }
})

authors.patch('/authors/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findOne({_id: id})
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} doesn't found`
            })
        }
        const dataUpdated = req.body;
        const options = {new: true}
        const result = await BlogAuthorsModel.findByIdAndUpdate(id, dataUpdated, options)
        res.status(200).send({
            message: `author by id ${id} modified`,
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }
})

authors.delete('/authors/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findByIdAndDelete(id);
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} doesn't found`
            })
        }
        res.status(200).send({
            message: `author by id ${id} deleted`
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error'
        })
    }
})

export default authors