import React, { useState, useEffect } from "react";

const LeaderboardComponent = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true); // State to show loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://dongchuyennghiep-backend.vercel.app/api/auth/leaderboardpickem', {
          method: 'POST', // If you are using POST, otherwise change to GET
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ limit: 10 }) // Optional: Limit top 10 users
        });

        const result = await response.json();

        if (response.ok) {
          setLeaderboardData(result.leaderboard); // Set the leaderboard data
        } else {
          throw new Error(result.message || 'Error fetching leaderboard');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to calculate ranks with shared placements
  const calculateRanks = (data) => {
    if (data.length === 0) return [];

    let rank = 1; // Start from rank 1
    let rankedData = [{ ...data[0], rank }]; // Initialize first rank
    
    for (let i = 1; i < data.length; i++) {
      // If the score is the same as the previous one, they share the same rank
      if (data[i].score === data[i - 1].score) {
        rankedData.push({ ...data[i], rank });
      } else {
        // Otherwise, increase the rank based on the current index
        rank = i + 1;
        rankedData.push({ ...data[i], rank });
      }
    }

    return rankedData;
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const rankedLeaderboardData = calculateRanks(leaderboardData);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center text-base-content">Leaderboard</h2>
      <div className="overflow-hidden">
        <table className="w-[95%] mx-auto">
          <tbody className="text-gray-600 text-sm font-light">
            {rankedLeaderboardData.map((user, index) => (
              <tr
                key={user._id || `${user.rank}-${index}`} // Use a combination of `user.rank` and `index` to ensure uniqueness
                className="border-b-[0.1px] first:border-t-[0.1px] border-base-content text-base-content transition duration-300 ease-in-out"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center  justify-center">
                    <span className="text-[12px] font-semibold lg:text-[16px]">{user.rank}</span>
                  </div>
                </td>
                <td className="lg:py-2 lg:px-6 text-left">
                  <div className="flex items-center">
                    <div className="lg:mr-3 mr-2">
                      <img
                        className="lg:w-12 lg:h-12 h-7 w-7 rounded-full"
                        src={`https://drive.google.com/thumbnail?id=${user.avatar}`} // Assuming the avatar URL is in the `avatar` field
                        alt={`${user.name}'s avatar`}
                      />
                    </div>
                    <span className="text-[11.5px] font-semibold lg:text-[14px]">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-[12px] font-semibold lg:text-[16px]">{user.score}</span> {/* Display user's score */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardComponent;