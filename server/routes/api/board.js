var express = require('express');
var router = express.Router();

const { Board } = require('../../models/Board');
const { User } = require('../../models/User');
router.post('/write', (req, res) => { 
    const post = new Board(req.body);

    post.save((err, doc) => { 
        if (err) return res.json({ success: false, error: err });
        return res.status(200).json({
            success: true,
            postData: doc
        })
    })
})


router.get('/list', async (req, res) => { 
    console.log(req.query)
    const page = Number(req.query.page || 1); // 값이 없다면 기본값으로 1 사용
    const perPage = Number(req.query.perPage || 10);
    const SortBy = req.query.sortBy || 'createdAt';
    const SortOrder = req.query.sortOrder || -1;
    const conditionA = req.query.searchOptionA || '';
    const conditionB = req.query.searchOptionB || '';
    const sortByIdx = req.query.sortByIdx || -1;
    const total = await Board.countDocuments();
    let query = {};
   
    if (conditionA === 'title') {
        query = { 'title': conditionB }
    } else if (conditionA === 'writer') { 
        let id;
        await User.find({ 'userid': conditionB })
            .then(user => { 
                id = user[0]._id;
            })
        query = { 'writer': id }
    }
    // console.log(query)
   
    Board.find(query)
        .populate('writer')
        .sort([[SortBy, SortOrder]])
        .skip((page - 1) * perPage)
        .limit(perPage)
        .then(posts => { 
            let postarray = [];
            let index = 1;
            posts.map(post => { 
                postarray.push({
                    index: index++,
                    title: post.title,
                    writer: post.writer,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    _id: post._id
                })
            })
            
            if (sortByIdx == '1') {
                postarray=postarray.reverse()
            }
           
            console.log(posts.length)
            return res.status(200).json({
                success: true,
                posts: postarray,
                total: total,
                totalPage: Math.ceil(total / perPage)
            })
        })
        .catch((err) => { 
            return res.status(404).json({
                success: false,
                error: err
            })
        });
})

module.exports = router;