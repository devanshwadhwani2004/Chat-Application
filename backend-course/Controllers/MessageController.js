import Messages from "../models/MessageModel.js";

export const getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const displayedMessages = messages.map((msg) => ({
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
        }));

        return res.json(displayedMessages);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            return res.json({ msg: "Message added successfully" });
        } else {
            return res.json({ msg: "Failed to add message to the database" });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};