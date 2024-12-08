import express from 'express';
import { signin, signup,teamHOF,leagueHOF,findleagueHOF,findteamHOF, signout,getCorrectAnswers,comparePredictionmultiple,calculateMaxPoints,getUserPickemScore,comparePredictions, submitPrediction, submitCorrectAnswer, leaderboardpickem, finduserPrediction, findPlayer, findAllteam, addBanPickVeto, findBanPickVeto, addAllGame, findAllGame, addMatchID, findAllMatchID, findmatchID } from '../controllers/auth.controller.js';
import QuestionPickem from '../models/question.model.js';
import Response from '../models/response.model.js';
import TeamRegister from '../models/registergame.model.js'
import Match from '../models/match.model.js';
import User from '../models/user.model.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.post('/findallgame', findAllGame)
router.post('/findplayer', findPlayer)
router.post('/banpick', addBanPickVeto)
router.post('/findbanpick', findBanPickVeto)
router.post('/allgame', addAllGame)
router.post('/addmatch', addMatchID)
router.post('/findallmatchid', findAllMatchID)
router.post('/findmatchid', findmatchID)
router.post('/findallteamAOV', findAllteam)
router.post('/submitPrediction', submitPrediction)
router.post('/checkuserprediction', finduserPrediction)
router.post('/addcorrectanswer', submitCorrectAnswer)
router.post('/comparepredictions', comparePredictions);
router.post('/leaderboardpickem', leaderboardpickem)
router.post('/scoreformanyids', comparePredictionmultiple)
router.post('/getCorrectAnswers', getCorrectAnswers)
router.post('/maxscore',calculateMaxPoints)
router.post('/teamHOF', teamHOF)
router.post('/teams/:league', findteamHOF)
router.post('/leagues/list', findleagueHOF)
router.post('/leagues', leagueHOF)
router.post('/myrankpickem', getUserPickemScore)
router.post('/upsertquestionsWithDynamicLogo', async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid input. Please provide an array of questions.' });
        }

        // Default profile picture if no matching user found
        const defaultProfilePic = '1wRTVjigKJEXt8iZEKnBX5_2jG7Ud3G-L';

        for (const question of questions) {
            if (!question.id || !question.question || !question.maxChoose || !question.timelock || !question.type) {
                return res.status(400).json({
                    error: 'Invalid input. Please provide all required fields (id, question, maxChoose, type, and options).'
                });
            }

            // If options are empty, populate them from gameMembers for "Liên Quân Mobile" only
            const optionsWithDynamicLogo = question.options && question.options.length > 0
                ? question.options
                : await TeamRegister.find({ games: "Liên Quân Mobile" }).then(async (teams) =>
                    Promise.all(
                        teams.flatMap(async (team) => {
                            const memberOptions = await Promise.all(
                                Array.from(team.gameMembers.get("Liên Quân Mobile") || []).map(async (member) => {
                                    const user = await User.findOne({ garenaaccount: member });
                                    return {
                                        name: member, // Use member name from gameMembers
                                        logo: user ? user.profilePicture : defaultProfilePic // Use profilePicture or default
                                    };
                                })
                            );
                            return memberOptions;
                        })
                    )
                );

            await QuestionPickem.findOneAndUpdate(
                { id: question.id },
                {
                    timelock: question.timelock,
                    question: question.question,
                    maxChoose: question.maxChoose,
                    type: question.type,
                    options: optionsWithDynamicLogo.flat() // Flatten the array to include all members as individual options
                },
                { upsert: true, new: true }
            );
        }

        res.status(201).json({ message: 'Questions added/updated successfully!' });
    } catch (error) {
        console.error('Error adding/updating questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/fetchplayerprofiles', async (req, res) => {
    try {
        const { players } = req.body; // Lấy danh sách các IGN từ request body
        const playerProfiles = await Promise.all(players.map(async (player) => {
            const user = await User.findOne({ garenaaccount: player });

            if (user) {
                return {
                    name: user.garenaaccount,
                    avatar: user.profilePicture,
                };
            }
            // Trả về thông tin mặc định nếu không tìm thấy người dùng
            return {
                name: player,
                avatar: '1wRTVjigKJEXt8iZEKnBX5_2jG7Ud3G-L', // Đường dẫn hoặc URL đến hình ảnh mặc định
            };
        }));

        res.status(200).json(playerProfiles);
    } catch (error) {
        console.error('Error fetching player profiles:', error);
        res.status(500).json({ error: 'Failed to fetch player profiles' });
    }
});
// Route để thêm mới trận đấu
router.post('/addmatchdetail', async (req, res) => {
    try {
        const match = new Match(req.body); // Lấy dữ liệu từ body request
        await match.save();
        res.status(201).json({ message: "Match added successfully", match });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to add match" });
    }
});
router.post('/fetchmatchAOV/:idmatch', async (req, res) => {
    const { idmatch } = req.params; // Lấy `idmatch` từ body của request

    if (!idmatch) {
        return res.status(400).json({ error: "idmatch is required" });
    }

    try {
        const match = await Match.findOne({ idmatch });
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(match);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch match" });
    }
});
// Route để cập nhật thông tin trận đấu
router.post('/updateMatch', async (req, res) => {
    const { idmatch } = req.body; // Giả sử chúng ta sử dụng `idmatch` làm điều kiện cập nhật
    try {
        const updatedMatch = await Match.findOneAndUpdate(
            { idmatch },
            req.body, // Dữ liệu mới từ request
            { new: true, runValidators: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ error: "Match not found" });
        }

        res.status(200).json({ message: "Match updated successfully", updatedMatch });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to update match" });
    }
});



router.post('/register', async (req, res) => {
    try {
        const { teamName, shortName, classTeam, logoUrl, games, gameMembers, usernameregister, discordID,color } = req.body;
        // Check if any member is already registered in another team
        const existingTeam = await TeamRegister.findOne({ gameMembers: { $in: gameMembers } });
        const newTeam = new TeamRegister({
            discordID,
            usernameregister,
            teamName,
            shortName,
            classTeam,
            logoUrl,
            color,
            games,
            gameMembers,
        });

        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        console.error('Error registering team:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/checkregisterAOV', async (req, res) => {
    try {
        const { usernameregister } = req.body;
        const game = "Liên Quân Mobile";
        const existingTeam = await TeamRegister.findOne({ usernameregister, games: { $in: [game] } });

        if (existingTeam) {
            // Nếu tìm thấy đội, trả lại thông tin đội
            return res.status(200).json(existingTeam);
        } 

        // Nếu không tìm thấy đội, trả lại lỗi 404
        return res.status(404).json({ message: 'Team not found' }); 

    } catch (error) {
        // Xử lý lỗi server
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/checkregisterTFT', async (req, res) => {
    try {
        const { usernameregister } = req.body;
        const game = "Teamfight Tactics";
        const existingTeam = await TeamRegister.findOne({ usernameregister, games: { $in: [game] } });

        if (existingTeam) {
            // Nếu tìm thấy đội, trả lại thông tin đội
            return res.status(200).json(existingTeam);
        } 

        // Nếu không tìm thấy đội, trả lại lỗi 404
        return res.status(404).json({ message: 'Team not found' }); 

    } catch (error) {
        // Xử lý lỗi server
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/allteamAOVcolor', async (req, res) => {
    try {
        const { usernameregister } = req.body;

        // Fetch only teamName, logoUrl, and color fields
        const teams = await TeamRegister.find().select('teamName shortName logoUrl color');

        if (teams.length > 0) {
            // If teams are found, return the relevant information
            return res.status(200).json(teams);
        } else {
            return res.status(404).json({ message: 'No teams found' });
        }

    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upsertquestions', async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid input. Please provide an array of questions.' });
        }

        for (const question of questions) {
            if (!question.id || !question.question || !question.maxChoose || !question.timelock || !question.type || !question.options) {
                return res.status(400).json({
                    error: 'Invalid input. Please provide all required fields (id, question, maxChoose, type, and options).'
                });
            }

            // Check if options is empty and populate it with teams' names and logos for "Liên Quân Mobile" only
            const optionsWithLogos = question.options.length > 0
                ? await Promise.all(
                    question.options.map(async (option) => {
                        const team = await TeamRegister.findOne({ teamName: option.name });
                        return {
                            name: option.name,
                            logo: team ? team.logoUrl : null // Default to null if no team found
                        };
                    })
                )
                : await TeamRegister.find({ games: "Liên Quân Mobile" }).then((teams) =>
                    teams.map((team) => ({
                        name: team.teamName,
                        logo: team.logoUrl
                    }))
                );

            await QuestionPickem.findOneAndUpdate(
                { id: question.id,category: question.category },
                {
                    timelock: question.timelock,
                    question: question.question,
                    maxChoose: question.maxChoose,
                    type: question.type,
                    options: optionsWithLogos,
                    category:question.category
                },
                { upsert: true, new: true }
            );
        }

        res.status(201).json({ message: 'Questions added/updated successfully!' });
    } catch (error) {
        console.error('Error adding/updating questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/getquestions', async (req, res) => {
    try {
      const questions = await QuestionPickem.find(); // Fetch all questions
      if (!questions) {
        return res.status(404).json({ message: 'No questions found.' });
      }
      res.status(200).json({ data: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Server error. Unable to fetch questions.' });
    }
  });
router.post('/findrespond', async (req, res) => {
    const { userId } = req.body;
    const response = await Response.findOne({ userId });
    res.json(response);
});




export default router;
