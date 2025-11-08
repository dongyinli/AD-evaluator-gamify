// Shared questions for ALL videos (Questions 1-6)
export const SHARED_QUESTIONS = [
    {
        id: 1,
        text: 'Accuracy & Clarity: Were the descriptions factually correct and easy to understand? (i.e. Were the names, locations, and actions identified correctly without jargon or mistakes?)'
    },
    {
        id: 2,
        text: 'Prioritization: Did the descriptions tell you the most important things you needed to know, without too much extra details? (i.e. Did the description leave out essential actions (long, confusing pauses) OR did it include so many unecessary details that it became distracting?)'
    },
    {
        id: 3,
        text: 'Consistency: Did the description maintain a consistent style, tone, and use of terms? (i.e. Was the language level right for the content, and did the describer use the same name/term for the same person/object throughout?)'
    },
    {
        id: 4,
        text: 'Objectivity: Did the description stick to objective facts and actions, without adding personal bias or unnecessary interpretation? (i.e. Did the describer tell you what to think instea of what they saw?)'
    },
    {
        id: 5,
        text: 'Timing & Placement: Were the descriptions placed seamlessly, without cutting off dialogue or sound effects? (i.e. Were the descriptions too early or too late relative to the action, or did they interrupt the original audio?)'
    },
    {
        id: 6,
        text: 'Use of Extended Description: If the video paused for a description, did this feel necessary and helpful? (i.e. Was the extended description used appropriately for text, complex scenes, or when time was otherwise tight?)'
    }
];

// Helper function to create video object with questions
const createVideo = (id, title, type, order, youDescribeUrl, groundTruth) => {
    return {
        id,
        title,
        type,
        order,
        youDescribeUrl,
        questions: SHARED_QUESTIONS.map(q => ({
            ...q,
            correctAnswer: groundTruth[q.id].answer,
            justification: groundTruth[q.id].justification || ''
        }))
    };
};

// 4 TRAINING VIDEOS
export const TRAINING_VIDEOS = [
    // Frozen Trailer Gemini
    createVideo(
        'training1',
        'Training Video 1',
        'training',
        1,
        'https://www.ydxlana.online/embed/EnnZnxhDU-4?ad=688fadcd54d66fdeb00d79cf',
        {
            1: { answer: 4, justification: "There are a few minor mistakes: the description of the Disney logo is missing; 'stick' is used instead of the more accurate 'Olaf's stick arm'; and the explanation of how Sven's hair causes Olaf to sneeze again is omitted." },
            2: { answer: 4, justification: "Good prioritization overall, such as correctly naming 'Sven the reindeer.' However, some parts are over-described, which distracts from emphasizing the musical themes of the animation." },
            3: { answer: 4, justification: "The writing maintains a consistent style and uses vocabulary appropriate for a children's audience. However, there are some verb tense mistakes—for example: 'Sven's head emerges from the water near the carrot, but his tongue got stuck on the ice.'" },
            4: { answer: 5, justification: 'Fully objective and focus only on the visible facts.' },
            5: { answer: 4, justification: "Generally good timing and placement. However, some AD was too early—for example, Olaf’s nose popping off was described at 14:00 but does not actually occur until about 5 seconds later." },
            6: { answer: 4, justification: "No extended descriptions, which was a good choice for the entertainment category. However, in one or two cases, sounds or actions were presented without describing the accompanying visuals, where an extended description could have been helpful." }
        }
    ),
    // Makeup Human
    createVideo(
        'training2',
        'Training Video 2',
        'training',
        2,
        'https://www.ydxlana.online/embed/i1GyF14WKjQ?ad=688d40f1635c3fb094bbe95a',
        {
            1: { answer: 4, justification: "The details are vague for a step by step video." },
            2: {
                answer: 2,
                justification: "Some descriptions were unnecessary because Roxetta already provided the information directly. For example, she introduces herself verbally, so viewers do not need an additional description stating 'she is introducing herself.'"
            },
            3: {
                answer: 3,
                justification: "The description lacks clear and consistent language for directionality. Terms such as 'blend it out' are vague without specifying the brush used, the stroke, or the direction (e.g., blending toward the hairline)."
            },
            4: {
                answer: 4,
                justification: "Mostly objective overall, but phrases like 'as you can see' are not helpful for non-visual audiences."
            },
            5: {
                answer: 2,
                justification: "Descriptions were not consistently placed to match the flow of the video. There were long gaps where visuals passed without any narration, creating uneven coverage. These timing gaps made the descriptions feel disconnected from the action and less seamlessly integrated with the original audio."
            },
            6: {
                answer: 3,
                justification: "Many extended descriptions felt unnecessary and added little value to understanding the content. The descriptions often interrupted the tutorial flow without providing new or essential information."
            }

        }
    ),
    // Elf Trailer Human
    createVideo(
        'training3',
        'Training Video 3',
        'training',
        3,
        'https://www.ydxlana.online/embed/dJU1SZIfK3Y?ad=6889abc616020c4c702ea281',
        {
            1: { 
                answer: 3, 
                justification: "An inaccurate description occurs when Buddy turns around after overhearing the other elves: the AD says he 'exits the building,' which is incorrect and misleading. It also states he is in the toy closet, which he is not." 
            },
            2: { 
                answer: 2, 
                justification: "The narration lacks a consistent narrative style. At some points it provides detail, while at others it drops off, creating gaps and disrupting consistency in tone and flow."
            },
            3: { 
                answer: 4, 
                justification: "The description style is not fully consistent. At times, the tone and terminology shift, making the narration feel uneven rather than maintaining a uniform style throughout." 
            },
            4: { 
                answer: 3, 
                justification: "Several interpretation and editorializing appear, such as 'looks extremely shocked,' which imposes judgment. The AD also explains why Buddy is having flashbacks instead of simply describing the flashback scenes." 
            },
            5: { 
                answer: 4, 
                justification: "The description could have been placed slightly earlier and not in the middle of dialogue." 
            },
            6: { 
                answer: 3, 
                justification: "Extended descriptions are used when not needed (they could have been inserted inline since there was no dialogue), and at the same time there is not enough overall description." 
            }
        }
        
    ),
    // Jane Goodall Gemini
    createVideo(
        'training4',
        'Training Video 4',
        'training',
        4,
        'https://www.ydxlana.online/embed/_1DDhUnyvwY?ad=68903a6254d66fdeb00d899d',
        {
            1: { answer: 5, justification: 'Clear and accurate information throughout.' },
            2: { answer: 5, justification: 'Clear and well-developed descriptions of visual actions.' },
            3: { answer: 5, justification: 'Content was described with consistent language.' },
            4: { answer: 5, justification: 'Maintained objectivity throughout.' },
            5: { answer: 4, justification: 'Overall good placement with some minor interruptions.' },
            6: { answer: 4, justification: 'Some descriptions interrupted the speaker in noticeable ways that was not smooth such as extended descriptions about the snakes and bugs.' }
        }
    )
];

export const TEST_VIDEOS = [
    // Star Wars Human
    createVideo(
        'test1',
        'Test Video 1',
        'test',
        1,
        'https://www.ydxlana.online/embed/adzYW5DZoWs?ad=6883cc2feec5c3a2c62b475f',
        {
            1: { answer: 5 },
            2: { answer: 5 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 5 },
            6: { answer: 5 }
        }
    ),
    // Star Wars Qwen
    createVideo(
        'test2',
        'Test Video 2',
        'test',
        2,
        'https://www.ydxlana.online/embed/adzYW5DZoWs?ad=68890c2b16020c4c702e862e',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 3 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 3 }
        }
    ),
    // Star Wars GPT
    createVideo(
        'test3',
        'Test Video 3',
        'test',
        3,
        'https://www.ydxlana.online/embed/adzYW5DZoWs?ad=68890e0716020c4c702e87f3',
        {
            1: { answer: 5 },
            2: { answer: 5 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // Jane Goodall Human
    createVideo(
        'test4',
        'Test Video 4',
        'test',
        4,
        'https://www.ydxlana.online/embed/_1DDhUnyvwY?ad=6890169154d66fdeb00d860d',
        {
            1: { answer: 2 },
            2: { answer: 2 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 2 },
            6: { answer: 2 }
        }
    ),
    // Jane Goodall Qwen
    createVideo(
        'test5',
        'Test Video 5',
        'test',
        5,
        'https://www.ydxlana.online/embed/_1DDhUnyvwY?ad=689017a954d66fdeb00d873c',
        {
            1: { answer: 4 },
            2: { answer: 3 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Jane Goodall GPT
    createVideo(
        'test6',
        'Test Video 6',
        'test',
        6,
        'https://www.ydxlana.online/embed/_1DDhUnyvwY?ad=6890432a54d66fdeb00d8d2c',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Elf Gemini
    createVideo(
        'test7',
        'Test Video 7',
        'test',
        7,
        'https://www.ydxlana.online/embed/dJU1SZIfK3Y?ad=688acc6c16020c4c702ec140',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 4 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Elf Qwen
    createVideo(
        'test8',
        'Test Video 8',
        'test',
        8,
        'https://www.ydxlana.online/embed/dJU1SZIfK3Y?ad=688ac54016020c4c702ec01f',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 5 },
            6: { answer: 5 }
        }
    ),
    // Elf GPT
    createVideo(
        'test9',
        'Test Video 9',
        'test',
        9,
        'https://www.ydxlana.online/embed/dJU1SZIfK3Y?ad=688aeb2e16020c4c702ec4f7',
        {
            1: { answer: 3 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 3 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Crash Course Kids Human
    createVideo(
        'test10',
        'Test Video 10',
        'test',
        10,
        'https://www.ydxlana.online/embed/Fnd-2jetT1w?ad=68892aa416020c4c702e8a1f',
        {
            1: { answer: 3 },
            2: { answer: 3 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 3 },
            6: { answer: 3 }
        }
    ),
    // Crash Course Kids Qwen
    createVideo(
        'test11',
        'Test Video 11',
        'test',
        11,
        'https://www.ydxlana.online/embed/Fnd-2jetT1w?ad=68911faddbae5c3ed416c486',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 3 }
        }
    ),
    // Crash Course Kids GPT
    createVideo(
        'test12',
        'Test Video 12',
        'test',
        12,
        'https://www.ydxlana.online/embed/Fnd-2jetT1w?ad=6889600416020c4c702e9739',
        {
            1: { answer: 5 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Lady Bird Human
    createVideo(
        'test13',
        'Test Video 13',
        'test',
        13,
        'https://www.ydxlana.online/embed/cNi_HC839Wo?ad=688af4a616020c4c702ec5b2',
        {
            1: { answer: 5 },
            2: { answer: 5 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // Lady Bird Qwen
    createVideo(
        'test14',
        'Test Video 14',
        'test',
        14,
        'https://www.ydxlana.online/embed/cNi_HC839Wo?ad=688b0cdb16020c4c702ecac8',
        {
            1: { answer: 4 },
            2: { answer: 3 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 3 }
        }
    ),
    // Lady Bird GPT
    createVideo(
        'test15',
        'Test Video 15',
        'test',
        15,
        'https://www.ydxlana.online/embed/cNi_HC839Wo?ad=688bf9db16020c4c702ef4b1',
        {
            1: { answer: 4 },
            2: { answer: 3 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 3 }
        }
    ),
    // 5 Minute Makeup Gemini
    createVideo(
        'test16',
        'Test Video 16',
        'test',
        16,
        'https://www.ydxlana.online/embed/i1GyF14WKjQ?ad=688ea804635c3fb094bc0f04',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // 5 Minute Makeup Qwen
    createVideo(
        'test17',
        'Test Video 17',
        'test',
        17,
        'https://www.ydxlana.online/embed/i1GyF14WKjQ?ad=688ea695635c3fb094bc0d9a',
        {
            1: { answer: 4 },
            2: { answer: 5 },
            3: { answer: 5 },
            4: { answer: 4 },
            5: { answer: 5 },
            6: { answer: 5 }
        }
    ),
    // 5 Minute Makeup GPT
    createVideo(
        'test18',
        'Test Video 18',
        'test',
        18,
        'https://www.ydxlana.online/embed/i1GyF14WKjQ?ad=688ede5d9b07c9dc6864a77f',
        {
            1: { answer: 5 },
            2: { answer: 5 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 5 },
            6: { answer: 5 }
        }
    ),
    // Origami Human
    createVideo(
        'test19',
        'Test Video 19',
        'test',
        19,
        'https://www.ydxlana.online/embed/oUCSXtTHo5s?ad=688c06531fb6b58fa67263fd',
        {
            1: { answer: 4 },
            2: { answer: 5 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 3 },
            6: { answer: 5 }
        }
    ),
    // Origami Qwen
    createVideo(
        'test20',
        'Test Video 20',
        'test',
        20,
        'https://www.ydxlana.online/embed/oUCSXtTHo5s?ad=688c008316020c4c702ef63d',
        {
            1: { answer: 2 },
            2: { answer: 2 },
            3: { answer: 3 },
            4: { answer: 5 },
            5: { answer: 3 },
            6: { answer: 3 }
        }
    ),
    // Origami GPT
    createVideo(
        'test21',
        'Test Video 21',
        'test',
        21,
        'https://www.ydxlana.online/embed/oUCSXtTHo5s?ad=688c62241fb6b58fa672681f',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // Bald Eagles Human
    createVideo(
        'test22',
        'Test Video 22',
        'test',
        22,
        'https://www.ydxlana.online/embed/oKficmlxzaI?ad=688fcc6754d66fdeb00d7c1a',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Bald Eagles Qwen
    createVideo(
        'test23',
        'Test Video 23',
        'test',
        23,
        'https://www.ydxlana.online/embed/oKficmlxzaI?ad=688ffa0354d66fdeb00d7f1c',
        {
            1: { answer: 5 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 4 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // Bald Eagles GPT
    createVideo(
        'test24',
        'Test Video 24',
        'test',
        24,
        'https://www.ydxlana.online/embed/oKficmlxzaI?ad=68900c6254d66fdeb00d8468',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // 3 Ways Pickles Human
    createVideo(
        'test25',
        'Test Video 25',
        'test',
        25,
        'https://www.ydxlana.online/embed/ajzArdLK6tE?ad=6889679816020c4c702e9c0b',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // 3 Ways Pickles Qwen
    createVideo(
        'test26',
        'Test Video 26',
        'test',
        26,
        'https://www.ydxlana.online/embed/ajzArdLK6tE?ad=688965cc16020c4c702e9b88',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 3 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
    // 3 Ways Pickles GPT
    createVideo(
        'test27',
        'Test Video 27',
        'test',
        27,
        'https://www.ydxlana.online/embed/ajzArdLK6tE?ad=6889946c16020c4c702ea176',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // Frozen Trailer Human
    createVideo(
        'test28',
        'Test Video 28',
        'test',
        28,
        'https://www.ydxlana.online/embed/EnnZnxhDU-4?ad=688ecd577d564a0e5d5dabe6',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 5 },
            4: { answer: 4 },
            5: { answer: 4 },
            6: { answer: 5 }
        }
    ),
    // Frozen Trailer Qwen
    createVideo(
        'test29',
        'Test Video 29',
        'test',
        29,
        'https://www.ydxlana.online/embed/EnnZnxhDU-4?ad=688ec39e635c3fb094bc106c',
        {
            1: { answer: 3 },
            2: { answer: 3 },
            3: { answer: 3 },
            4: { answer: 4 },
            5: { answer: 3 },
            6: { answer: 4 }
        }
    ),
    // Frozen Trailer GPT
    createVideo(
        'test30',
        'Test Video 30',
        'test',
        30,
        'https://www.ydxlana.online/embed/EnnZnxhDU-4?ad=688fb87954d66fdeb00d7b03',
        {
            1: { answer: 4 },
            2: { answer: 4 },
            3: { answer: 4 },
            4: { answer: 5 },
            5: { answer: 4 },
            6: { answer: 4 }
        }
    ),
];

// Helper to check if training phase is complete
export const isTrainingComplete = (completedVideoIds) => {
    const trainingIds = TRAINING_VIDEOS.map(v => v.id);
    return trainingIds.every(id => completedVideoIds.includes(id));
};