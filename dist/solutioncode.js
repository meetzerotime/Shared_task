"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const quiz_json_1 = __importDefault(require("./data/quiz.json"));
const response_json_1 = __importDefault(require("./data/response.json"));
const format_json_1 = __importDefault(require("./data/format.json"));
const section_json_1 = __importDefault(require("./data/section.json"));
function CombinedPoints(userSelectedTopicIds, userSelectedFormatIds, userSelectedSourceIds) {
    let playingFormatId = 0;
    let selfPractFormatId = 0;
    let readingFormatId = 0;
    for (const formatItem of format_json_1.default) {
        if (formatItem.title === "Playing") {
            playingFormatId = formatItem.id;
        }
        else if (formatItem.title === "Self-practicing") {
            selfPractFormatId = formatItem.id;
        }
        else if (formatItem.title === "Reading") {
            readingFormatId = formatItem.id;
        }
    }
    for (let resp of response_json_1.default) {
        // News section
        if (resp.section_type === "news") {
            resp.points = 0;
            // Format
            if (userSelectedFormatIds.includes(readingFormatId)) {
                resp.points = 10;
            }
            for (const content of resp.content) {
                //@ts-ignore
                if (userSelectedTopicIds.includes(content.topic_id)) {
                    resp.points += 100;
                }
            }
        }
        // Games Section
        if (resp.section_type === "games") {
            resp.points = 0;
            // Format
            if (userSelectedFormatIds.includes(playingFormatId)) {
                resp.points = 10;
            }
        }
        // Quiz section
        else if (resp.section_type === "Quiz") {
            resp.points = 0;
            // Format
            if (userSelectedFormatIds.includes(playingFormatId) || userSelectedFormatIds.includes(selfPractFormatId)) {
                resp.points = 10;
            }
            // Topic condition
            for (const content of resp.content) {
                for (const quizItem of quiz_json_1.default) {
                    //@ts-ignore
                    if (content.id === quizItem.id && userSelectedTopicIds.includes(quizItem.topic_id)) {
                        resp.points += 100;
                    }
                }
            }
        }
        // Custom section items
        else if (resp.section_type === "Flight") {
            resp.points = 0;
            for (let content of resp.content) {
                //@ts-ignore
                if (userSelectedFormatIds.includes(content.format_id || 0)) {
                    resp.points += 10;
                }
                //@ts-ignore
                if (userSelectedSourceIds.includes(content.source_id || 0)) {
                    resp.points += 10;
                }
                // Topic
                for (let sectionitem of section_json_1.default) {
                    if (sectionitem.id === resp.section_id && userSelectedTopicIds.includes(sectionitem.topic_id)) {
                        resp.points += 100;
                    }
                }
            }
        }
    }
    //@ts-ignore
    return response_json_1.default.sort((a, b) => b.points - a.points);
}
// Usage
function getdata(req, res) {
    const userSelectedTopicIds = req.body.userSelectedTopicIds || [];
    const userSelectedFormatIds = req.body.userSelectedFormatIds || [];
    const userSelectedSourceIds = req.body.userSelectedSourceIds || [];
    res.json(CombinedPoints(userSelectedTopicIds, userSelectedFormatIds, userSelectedSourceIds));
}
module.exports = getdata;
