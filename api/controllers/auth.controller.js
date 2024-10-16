import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import BanPick from '../models/veto.model.js';
import AllGame from '../models/allgame.model.js';
import MatchID from '../models/matchid.model.js';
import TeamRegister from '../models/registergame.model.js'
import PredictionPickem from '../models/response.model.js';
import CorrectAnswersSubmit from '../models/correctanswer.model.js';
import AllUserScore from '../models/alluserscore.model.js';
export const signup = async (req, res, next) => {
  const { riotID, username, password, discordID } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ riotID, username, discordID, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'Tạo tài khoản thành công' });
  } catch (error) {
    return next(errorHandler(500, 'Tạo tài khoản thất bại'));
  }
};
export const comparePredictions = async (req, res) => {
  try {
    const { userId } = req.body;  // Expecting userId in the request body

    // Fetch the user's predictions by userId
    const userPrediction = await PredictionPickem.findOne({ userId });
    if (!userPrediction) {
      return res.status(404).json({ message: 'User prediction not found' });
    }

    // Fetch the correct answers
    const correctAnswers = await CorrectAnswersSubmit.findOne();
    if (!correctAnswers) {
      return res.status(404).json({ message: 'Correct answers not found' });
    }

    // Initialize counters
    let totalCorrectChoices = 0;
    let totalPossibleChoices = 0;
    let totalPoints = 0;
    let detailedResults = [];

    // Point system based on questionId
    const pointSystem = {
      3: 5,   // Question 3 is worth 5 points per correct answer
      4: 20,  // Question 4 is worth 20 points per correct answer
      5: 8    // Question 5 is worth 8 points per correct answer
    };

    // Iterate over the user's predictions
    userPrediction.answers.forEach((userAnswer) => {
      // Find the corresponding correct answer for the same questionId
      const correctAnswer = correctAnswers.answers.find(
        (ans) => ans.questionId === userAnswer.questionId
      );

      if (correctAnswer) {
        // Count how many teams the user got right
        let correctChoicesForQuestion = 0;
        correctAnswer.correctTeams.forEach((correctTeam) => {
          if (userAnswer.selectedTeams.includes(correctTeam)) {
            correctChoicesForQuestion += 1;
          }
        });

        // Calculate points for this question
        const pointsForQuestion = correctChoicesForQuestion * (pointSystem[userAnswer.questionId] || 0);
        totalPoints += pointsForQuestion;

        // Add detailed result for the question
        detailedResults.push({
          questionId: userAnswer.questionId,
          correctChoices: correctChoicesForQuestion,
          totalChoices: correctAnswer.correctTeams.length,
          pointsForQuestion
        });

        // Increment the total counts
        totalCorrectChoices += correctChoicesForQuestion;
        totalPossibleChoices += correctAnswer.correctTeams.length;
      }
    });

    // Save the total score to AllUserScore collection
    await AllUserScore.findOneAndUpdate(
      { userID: userId },  // Find by userId
      { userID: userId, totalScore: totalPoints },  // Update or set the totalScore
      { upsert: true, new: true }  // Create a new document if not found, return the updated document
    );

    // Return the detailed result and the total number of correct answers and points
    res.status(200).json({
      message: `User got ${totalCorrectChoices} out of ${totalPossibleChoices} choices correct and earned ${totalPoints} points.`,
      totalCorrectChoices,
      totalPossibleChoices,
      totalPoints,
      detailedResults
    });
  } catch (error) {
    console.error('Error comparing predictions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitPrediction = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Validate request body
    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid input. Please provide userId and answers.' });
    }

    // Find the user's prediction
    const existingPrediction = await PredictionPickem.findOne({ userId });

    if (existingPrediction) {
      // Loop through new answers and update or add them to existing answers
      answers.forEach((newAnswer) => {
        const existingAnswerIndex = existingPrediction.answers.findIndex(
          (answer) => answer.questionId === newAnswer.questionId
        );

        if (existingAnswerIndex !== -1) {
          // Update existing answer
          existingPrediction.answers[existingAnswerIndex].selectedTeams = newAnswer.selectedTeams;
        } else {
          // Add new answer if the questionId doesn't exist
          existingPrediction.answers.push(newAnswer);
        }
      });

      // Save the updated prediction
      await existingPrediction.save();

      res.status(200).json({
        message: 'Prediction updated successfully!',
        data: existingPrediction,
      });
    } else {
      // If no existing prediction, create a new one
      const newPrediction = new PredictionPickem({
        userId,
        answers,
      });

      await newPrediction.save();

      res.status(201).json({
        message: 'Prediction submitted successfully!',
        data: newPrediction,
      });
    }
  } catch (error) {
    console.error('Error submitting prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const leaderboardpickem = async (req, res) => {
  try {
    // Fetch the leaderboard data sorted by totalScore
    const leaderboardEntries = await AllUserScore.find({})
      .sort({ totalScore: -1 })  // Sort by totalScore in descending order

    // Create an array to hold the enriched leaderboard data
    const enrichedLeaderboard = await Promise.all(
      leaderboardEntries.map(async (entry) => {
        // Fetch the corresponding user data
        const user = await User.findOne({ _id: entry.userID });
        if (user) {
          return {
            name: user.username,           // User's name
            avatar: user.profilePicture,   // User's profile picture
            score: entry.totalScore        // User's score
          };
        } else {
          return null;  // Handle case where user is not found (optional)
        }
      })
    );

    // Filter out any null values (in case any user wasn't found)
    const filteredLeaderboard = enrichedLeaderboard.filter(entry => entry !== null);

    // Send the enriched leaderboard data as the response
    res.status(200).json({
      message: 'Leaderboard fetched successfully!',
      leaderboard: filteredLeaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getUserPickemScore = async (req, res) => {
  try {
    const { userID } = req.body; // Assuming you're sending the userId in the request body

    // Find the user's score in the AllUserScore collection
    const userScoreEntry = await AllUserScore.findOne({ userID: userID });

    if (!userScoreEntry) {
      return res.status(404).json({ message: "User score not found" });
    }

    // Find the user's details in the User collection
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the response data
    const userData = {
      name: user.username,          // User's name
      avatar: user.profilePicture,  // User's profile picture
      score: userScoreEntry.totalScore // User's total score
    };

    // Send the user's data as the response
    res.status(200).json({
      message: "User score and image fetched successfully!",
      userData: userData
    });
  } catch (error) {
    console.error('Error fetching user score:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const submitCorrectAnswer = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validate the input
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of answers.' });
    }

    // Loop through each answer and update/add correct answers for each question
    for (const answer of answers) {
      const { questionId, correctTeams } = answer;

      if (!questionId || !correctTeams || !Array.isArray(correctTeams)) {
        return res.status(400).json({ error: `Invalid input for questionId: ${questionId}. Please provide questionId and correctTeams.` });
      }

      // Check if the document with the correct answers exists
      const existingDocument = await CorrectAnswersSubmit.findOne({
        'answers.questionId': questionId
      });

      if (existingDocument) {
        // Update the correctTeams for the existing questionId
        await CorrectAnswersSubmit.updateOne(
          { 'answers.questionId': questionId },
          { $set: { 'answers.$.correctTeams': correctTeams } }
        );
      } else {
        // If questionId doesn't exist, push a new answer into the answers array
        await CorrectAnswersSubmit.updateOne(
          {}, // You may want to target a specific document if needed
          { $push: { answers: { questionId, correctTeams } } },
          { upsert: true } // Create the document if it doesn't exist
        );
      }
    }

    // Fetch the updated correct answers
    const updatedCorrectAnswers = await CorrectAnswersSubmit.findOne();

    // Fetch all user predictions
    const allPredictions = await PredictionPickem.find();

    // Recalculate the score for each user based on the updated correct answers
    const pointSystem = {
      3: 5,   // Question 3 is worth 5 points per correct answer
      4: 20,  // Question 4 is worth 20 points per correct answer
      5: 8    // Question 5 is worth 8 points per correct answer
    };

    for (const prediction of allPredictions) {
      let totalPoints = 0;

      // Calculate points for each user's predictions
      prediction.answers.forEach((userAnswer) => {
        const correctAnswer = updatedCorrectAnswers.answers.find(
          (ans) => ans.questionId === userAnswer.questionId
        );

        if (correctAnswer) {
          let correctChoicesForQuestion = 0;
          correctAnswer.correctTeams.forEach((correctTeam) => {
            if (userAnswer.selectedTeams.includes(correctTeam)) {
              correctChoicesForQuestion += 1;
            }
          });

          const pointsForQuestion = correctChoicesForQuestion * (pointSystem[userAnswer.questionId] || 0);
          totalPoints += pointsForQuestion;
        }
      });

      // Update the user's total score in the AllUserScore collection
      await AllUserScore.findOneAndUpdate(
        { userID: prediction.userId },  // Find by userId
        { userID: prediction.userId, totalScore: totalPoints },  // Update the score
        { upsert: true, new: true }  // Create if not found
      );
    }

    res.status(201).json({ message: 'Correct answers added/updated and user scores recalculated successfully!' });
  } catch (error) {
    console.error('Error adding/updating correct answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const finduserPrediction = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find prediction by userId
    const prediction = await PredictionPickem.findOne({ userId });

    if (prediction) {
      return res.status(200).json({ message: 'Prediction found', data: prediction });
    } else {
      return res.status(404).json({ message: 'No prediction found for this user' });
    }
  } catch (error) {
    console.error('Error checking prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const addAllGame = async (req,res,next) => {
  const { url,game,image,description,badges } = req.body;
  try{
    const existingGame = await AllGame.findOne({game})
    if (existingGame){
      existingGame.url = url;
      existingGame.game = game;
      existingGame.image = image;
      existingGame.description = description;
      existingGame.badges = badges;
      await existingGame.save();
      res.status(200).json({ message: 'Game updated successfully' });
    }else{
      const newGame = new AllGame({
        url,game,image,description,badges
      });
      await newGame.save()
      res.status(201).json({message:"Game added succesfully"})
    }
  }catch(error){
    next(error)
  }
}

export const addMatchID = async (req, res, next) => {
  try {
    const { matchid, teamA, teamB, round,Match} = req.body;

    // Check if the required fields are provided
    if (!matchid || !teamA || !teamB || !round||!Match) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find if the matchid already exists
    let match = await MatchID.findOne({ matchid });

    if (match) {
      // Update the existing match details
      match.teamA = teamA;
      match.teamB = teamB;
      match.round = round;
      match.Match = Match;
      await match.save();
      return res.status(200).json({ message: "MatchID updated successfully" });
    } else {
      // Create a new match ID entry
      const newMatchId = new MatchID({ matchid, teamA, teamB, round,Match});
      await newMatchId.save();
      return res.status(201).json({ message: "MatchID added successfully" });
    }
  } catch (error) {
    // Handle errors properly
    return next(error);
  }
};
export const findAllMatchID = async (req, res, next) => {
  try {
    const allGame = await MatchID.find();

    if (!allGame || allGame.length === 0) {
      return next(errorHandler(404, 'No Game found'));
    }

    res.status(200).json(allGame);
  } catch (error) {
    next(error);
  }
};
export const findAllteam = async (req, res, next) => {
  try {
    const allTeam = await TeamRegister.find();

    if (!allTeam || allTeam.length === 0) {
      return next(errorHandler(404, 'No Game found'));
    }

    res.status(200).json(allTeam);
  } catch (error) {
    next(error);
  }
};

export const findmatchID = async (req, res, next) => {
  const { round, Match } = req.body
  try {
    const allGame = await MatchID.findOne({round, Match });

    if (!allGame || allGame.length === 0) {
      return next(errorHandler(404, 'No Game found'));
    }

    res.status(200).json(allGame);
  } catch (error) {
    next(error);
  }
};

export const findAllGame = async (req, res, next) => {
  try {
    const allGame = await AllGame.find();

    if (allGame.length === 0) {
      return next(errorHandler(404, 'No Game found'));
    }

    res.status(200).json(allGame);
  } catch (error) {
    next(error);
  }
};
export const addBanPickVeto = async (req, res) => {
  try {

      const { id,group, veto } = req.body;

      // Ensure veto is an array and not empty
      if (!Array.isArray(veto) || veto.length === 0) {
          return res.status(400).json({ error: 'Veto should be a non-empty array' });
      }

      const newBanPick = new BanPick({
          id,group,
          veto
      });

      await newBanPick.save();

      res.status(201).json(newBanPick);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};
export const findBanPickVeto = async (req, res) => {
  try {
 // Add logging to debug

      const { id,group } = req.body;

      const newBanPick = await BanPick.findOne({
        id,group
      });



      res.status(200).json(newBanPick);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};



export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username });

    if (!validUser) return next(errorHandler(404, 'Người dùng không tìm thấy'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Thông tin đăng nhập sai'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    if (!validUser._doc) return next(errorHandler(500, 'Không thể truy cập dữ liệu người dùng'));

    const { password: hashedPassword, ...rest } = validUser._doc;
    
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    return next(errorHandler(500, 'Lỗi máy chủ nội bộ'));
  }
};

export const findPlayer = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const validUser = await User.findOne({ _id  });

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    res.status(200).json(validUser);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};
