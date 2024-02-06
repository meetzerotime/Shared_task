import { Request, Response } from 'express'; // Assuming you're using Express

import quizData from "./data/quiz.json";
import responseData from "./data/response.json";
import formatData from "./data/format.json";
import sectionData from "./data/section.json";


interface ResponseItem {
  section_type: string;
  points: number;
  content: {
    topic_id: number;
    id: number;
    format_id?: number;
    source_id?: number;
  }[];
}

function CombinedPoints(userSelectedTopicIds: number[], userSelectedFormatIds: number[], userSelectedSourceIds: number[]): ResponseItem[] {
  let playingFormatId = 0;
  let selfPractFormatId = 0;
  let readingFormatId = 0;

  for (const formatItem of formatData) {
    if (formatItem.title === "Playing") {
      playingFormatId = formatItem.id;
    } else if (formatItem.title === "Self-practicing") {
      selfPractFormatId = formatItem.id;
    } else if (formatItem.title === "Reading") {
      readingFormatId = formatItem.id;
    }
  }

  for (let resp of responseData) {
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
        for (const quizItem of quizData) {
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
        for (let sectionitem of sectionData) {
          if (sectionitem.id === resp.section_id && userSelectedTopicIds.includes(sectionitem.topic_id)) {
            resp.points += 100;
          }
        }
      }
    }
  }
//@ts-ignore
return responseData.sort((a, b) => b.points - a.points);
  
}

// Usage
function getdata(req: Request, res: Response) {
  const userSelectedTopicIds: number[] = req.body.userSelectedTopicIds || [];
  const userSelectedFormatIds: number[] = req.body.userSelectedFormatIds || [];
  const userSelectedSourceIds: number[] = req.body.userSelectedSourceIds || [];
  res.json(CombinedPoints(userSelectedTopicIds, userSelectedFormatIds, userSelectedSourceIds));
}

export = getdata;
