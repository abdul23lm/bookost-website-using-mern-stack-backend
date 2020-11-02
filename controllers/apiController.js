const Item = require('../models/Item');
const Client = require('../models/Booking');
const Category = require('../models/Category');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
                .select('_id title country city price unit imageId')
                .limit(5)
                .populate({ path: 'imageId', select: '_id imageUrl' })
            const category = await Category.find()
                .select('_id name')
                .limit(3)
                .populate({
                    path: 'itemId',
                    select: '_id title country city unit imageId isPopular',
                    perDocumentLimt: 4,
                    option: {sort:{ sumBooking: -1 }},
                    populate: {
                        path: 'imageId',
                        select: '_id imageUrl',
                        perDocumentLimt: 1
                    }
                })
        const client = await Client.find();
        const city = await Item.find();
        const boardingHouse = await Item.find();

        for (let i = 0; i < category.length; i++) {
            for (let x = 0; x < category[i].itemId.length; x++) {
                const item = await Item.findOne({ _id: category[i].itemId[x]._id });
                item.isPopular = false;
                await item.save();
                if (category[i].itemId[0] === category[i].itemId[x]) {
                    item.isPopular = true;
                await item.save();
                }
            }
            }
            
          const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Testimonial Klien",
                rate: 4.55,
                content: "Pengalaman yang luar biasa ketika saya kesulitan menemukan kostan, BooKost solusinya ...",
                familyName: "Abdul",
                familyOccupation: "Frontend Developer"
            }
        
        res.status(200).json({
            hero: {
                clients: client.length,
                cities: city.length,
                boardingHouse: boardingHouse.length
            },
            mostPicked,
            category,
            testimonial
        })
    } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
    }
    }
}