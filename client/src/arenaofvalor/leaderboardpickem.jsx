import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MyNavbar2 from "../components/Navbar2";
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chart.js/auto';


// Register the annotation plugin
import { Chart } from 'chart.js';
Chart.register(annotationPlugin);

const LeaderboardComponent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [rankedLeaderboardData, setRankedLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRank, setUserRank] = useState(null);
  const [maxScore, SetMaxScore] = useState(null)
  const [points, setPoints] = useState([]);
  const [counts, setCounts] = useState([]);

  // State to store tier scores
  const [tierScores, setTierScores] = useState({
    sTierScore: 0,
    aTierScore: 0,
    bTierScore: 0,
    cTierScore: 0
  });

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.title = "Bảng xếp hạng Dự đoán";
  }, []);

  const navigationAll1 = {
    aov: [
      { name: "Đoán theo trận", href: "/arenaofvalor/pickem/pickemmatch", current: location.pathname === "/arenaofvalor/pickem/pickemmatch" },
      { name: "Đoán tổng thể", href: "/arenaofvalor/pickem/pickemall", current: location.pathname === "/arenaofvalor/pickem/pickemall" },
      { name: "Bảng xếp hạng", href: "/arenaofvalor/pickem/leaderboard", current: location.pathname === "/arenaofvalor/pickem/leaderboard" },
    ]
  };

  const getNavigation = () => navigationAll1.aov;

  const LeaderboardRow = ({ user, className, isSticky = false, highlightUser = false, tierColor }) => (
    <tr
      className={`border-b-[0.1px] ${className} first:border-t-[0.1px] border-opacity-20 ${
        isSticky ? "border-white text-white" : "border-base-content text-base-content"
      } transition duration-300 ease-in-out`}
      style={highlightUser ? { color: tierColor } : {}}
    >
      <td className={`px-4 py-3 text-left w-[10%] ${isSticky ? '' : 'first:border-0'}`}>
        <div className="flex items-center justify-center">
          <span
            className={`text-[12px] font-semibold md:text-[14px] ${highlightUser ? 'text-primary' : ''}`} // Remove text-primary
            style={highlightUser ? { color: tierColor } : {}}
          >
            {user.rank}
          </span>
        </div>
      </td>
      <td className="lg:py-2 lg:px-6 py-3 text-left w-[55%] lg:w-[68%]">
        <div className="flex items-center">
          <div className="lg:mr-3 mr-2">
            <img
              className="lg:w-14 lg:h-14 h-12 w-12 rounded-full"
              src={`https://drive.google.com/thumbnail?id=${user.avatar}`}
              alt={`${user.name}'s avatar`}
            />
          </div>
          <span
            className={`text-[12px] font-semibold md:text-[14px] ${highlightUser ? 'text-primary' : ''}`} // Remove text-primary
            style={highlightUser ? { color: tierColor } : {}}
          >
            {user.name}
          </span>
        </div>
      </td>
      <td className="py-3 px-6 text-center lg:w-[25%] w-[32%]">
        <div className="flex items-center justify-center">
          <span
            className={`text-[12px] font-semibold md:text-[16px] ${highlightUser ? 'text-primary' : ''}`} // Remove text-primary
            style={highlightUser ? { color: tierColor } : {}}
          >
            {user.score} PTS
          </span>
        </div>
      </td>
    </tr>
  );
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Bắt đầu trạng thái loading
  
        // Fetch leaderboard data
        const leaderboardResponse = fetch('https://dongchuyennghiep-backend.vercel.app/api/auth/leaderboardpickem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // Fetch max score
        const maxScoreResponse = fetch('https://dongchuyennghiep-backend.vercel.app/api/auth/maxscore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // Đợi cả hai API cùng trả về
        const [leaderboardResult, maxScoreResult] = await Promise.all([
          leaderboardResponse.then(res => res.json()),
          maxScoreResponse.then(res => res.json())
        ]);
  
        // Xử lý kết quả từ API
        if (leaderboardResult.leaderboard) {
          setLeaderboardData(leaderboardResult.leaderboard);
        } else {
          throw new Error(leaderboardResult.message || 'Error fetching leaderboard');
        }
  
        if (maxScoreResult.totalMaxPoints) {
          SetMaxScore(maxScoreResult.totalMaxPoints);
        } else {
          throw new Error(maxScoreResult.message || 'Error fetching max score');
        }
  
      } catch (error) {
        setError(error.message); // Xử lý lỗi
      } finally {
        setLoading(false); // Dừng trạng thái loading khi tất cả API hoàn thành
      }
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    if (leaderboardData.length > 0) {
      const calculateRanks = (data) => {
        let rank = 1;
        const rankedData = [{ ...data[0], rank }];

        for (let i = 1; i < data.length; i++) {
          if (data[i].score === data[i - 1].score) {
            rankedData.push({ ...data[i], rank });
          } else {
            rank = i + 1;
            rankedData.push({ ...data[i], rank });
          }
        }

        return rankedData;
      };

      const rankedData = calculateRanks(leaderboardData);
      setRankedLeaderboardData(rankedData);

      const currentUserRank = rankedData.find(user => user.name === currentUser.username);
      if (currentUserRank) {
        setUserRank({ ...currentUserRank });
      }
    }
  }, [leaderboardData, currentUser]);
  const TierRewardsTable = ({ userScore, tierScores }) => {
    const tiers = [
      { name: 'Perfect Picks', score: maxScore, reward: 'Danh hiệu Perfect Pick + TBD', highlight: userScore === maxScore,color: '#D4AF37'},
      { name: 'S', score: tierScores.sTierScore, top: "Top 5%", reward: 'Danh hiệu Tier S + TBD', highlight: userScore >= tierScores.sTierScore && userScore < maxScore, color: '#ff9800' },
      { name: 'A', score: tierScores.aTierScore, top: "Top 20%", reward: 'Danh hiệu Tier A', highlight: userScore >= tierScores.aTierScore && userScore < tierScores.sTierScore, color: '#CC52CE' },
      { name: 'B', score: tierScores.bTierScore, top: "Top 40%", reward: '', highlight: userScore >= tierScores.bTierScore && userScore < tierScores.aTierScore, color: '#00bcd4' },
      { name: 'C', score: tierScores.cTierScore, top: "Top 70%", reward: '', highlight: userScore >= tierScores.cTierScore && userScore < tierScores.bTierScore, color: '#4caf50' },
    ];
  
    return (
      <div className="w-full lg:w-full mx-auto mb-8">
        <h3 className="text-2xl font-bold text-base-content mb-4 text-center">Phần thưởng các Bậc</h3>
        <table className="w-[95%] mx-auto text-left border-collapse border-base-content">
          <tbody>
            {tiers.map((tier, index) => (
              <tr
                key={index}
                className={`border-b-2 border-base-content px-4 ${tier.highlight ? 'font-semibold' : ''}`}
                style={{ color: tier.highlight ? tier.color : 'inherit', borderBottomColor: tier.highlight ? tier.color : 'rgba(128, 128, 128, 0.18)' }}
              >
                {/* Remove extra spaces between tags */}
                <td className="border-base-content xl:px-4 px-1 py-3 w-[1px] md:w-[20%]">{tier.name}</td>
                <td className="border-base-content px-4 py-3">{tier.top}</td>
                <td className="border-base-content px-4 py-3">{tier.score} PTS</td>
                <td className="border-base-content px-4 py-3 text-right">{tier.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  useEffect(() => {
    if (rankedLeaderboardData.length > 0) {
      const sortedData = [...rankedLeaderboardData].sort((a, b) => b.score - a.score);

      const scoreCountMap = {};
      sortedData.forEach(user => {
        scoreCountMap[user.score] = (scoreCountMap[user.score] || 0) + 1;
      });

      const pointsData = Object.keys(scoreCountMap).map(Number);
      const countsData = Object.values(scoreCountMap);

      setPoints(pointsData);
      setCounts(countsData);

      // Calculate tier scores based on percentile
      const totalUsers = rankedLeaderboardData.length;

      const getPercentileScore = (percentile) => {
        const index = Math.floor((percentile / 100) * totalUsers);
        return rankedLeaderboardData[index]?.score || 0;
      };

      const sTierScore = getPercentileScore(5);  // Top 5%
      const aTierScore = getPercentileScore(20); // Top 20%
      const bTierScore = getPercentileScore(40); // Top 40%
      const cTierScore = getPercentileScore(70); // Top 70%

      // Map tier scores to the closest index on the X-axis
      const getClosestIndex = (score) => {
        let closestIndex = pointsData.findIndex(point => point >= score);
        return closestIndex !== -1 ? closestIndex : pointsData.length - 1;
      };

      const sTierIndex = getClosestIndex(sTierScore);
      const aTierIndex = getClosestIndex(aTierScore);
      const bTierIndex = getClosestIndex(bTierScore);
      const cTierIndex = getClosestIndex(cTierScore);

      // Set the tier scores correctly in state
      setTierScores({
        sTierScore,
        aTierScore,
        bTierScore,
        cTierScore,
        sTierIndex,
        aTierIndex,
        bTierIndex,
        cTierIndex
      });

      // Log for debugging
      console.log({ sTierScore, aTierScore, bTierScore, cTierScore });
      console.log({ sTierIndex, aTierIndex, bTierIndex, cTierIndex });
    }
  }, [rankedLeaderboardData]);

  const prepareChartData = () => {
    const { sTierScore, aTierScore, bTierScore, cTierScore } = tierScores; // Get tier scores from state
    const userScore = userRank ? userRank.score : null;
    const userScoreIndex = points.indexOf(userScore);

    // Function to determine the color of the line based on the score (points)
    const getPointColor = (point) => {
      if (point >= sTierScore) return '#ff9800'; // S Tier (orange)
      if (point >= aTierScore) return '#CC52CE'; // A Tier (pink)
      if (point >= bTierScore) return '#00bcd4'; // B Tier (cyan)
      if (point >= cTierScore) return '#4caf50'; // C Tier (green)
      return '#6A5ACD'; // D Tier (white for no tier)
    };

    return {
      labels: points,
      datasets: [
        {
          label: 'Number of Users',
          data: counts,
          borderColor: '#556B2F', // Default border color
          fill: false,
          borderWidth: 2,
          pointBackgroundColor: points.map((point, index) =>
            index === userScoreIndex ? '#6A5ACD' : '' // Highlight the user's score with a white dot
          ),
          pointRadius: points.map((point, index) =>
            index === userScoreIndex ? 6 : 0 // Larger dot for the current user
          ),
          segment: {
            borderColor: ctx => getPointColor(points[ctx.p0DataIndex]), // Color each segment according to the tier
          },
        },
        // Dummy datasets for showing legend labels only
        {
          label: 'Tier D',
          borderColor: '#6A5ACD',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 0,
          data: [], // No actual data, just for legend
          fill: false,
          borderWidth: 2,
          hidden: false, // Ensure it shows in the legend
        },
        {
          label: 'Tier C',
          borderColor: '#4caf50',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 0,
          borderWidth: 2,
          data: [], // No actual data, just for legend
          fill: false,
          hidden: false, // Ensure it shows in the legend
        },
        {
          label: 'Tier B',
          borderColor: '#00bcd4',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 0,
          borderWidth: 2,
          data: [], // No actual data, just for legend
          fill: false,
          hidden: false, // Ensure it shows in the legend
        },
        {
          label: 'Tier A',
          borderColor: '#CC52CE',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 0,
          borderWidth: 2,
          borderWidth: 2,
          data: [], // No actual data, just for legend
          fill: false,
          hidden: false, // Ensure it shows in the legend
        },
        {
          label: 'Tier S',
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 0,
          borderWidth: 2,
          data: [], // No actual data, just for legend
          fill: false,
          hidden: false, // Ensure it shows in the legend
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          filter: (legendItem) => legendItem.text !== 'Number of Users',
          color: "rgba(128, 128, 128,1)", // Update legend text color
          usePointStyle: true,
        },
        onClick: (e) => { }, // Disable the default legend click behavior
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      annotation: {
        annotations: {
          sTierLine: {
            type: 'line',
            xMin: tierScores.sTierIndex,  // Use the calculated index
            xMax: tierScores.sTierIndex,
            borderColor: '#ff9800',
            borderWidth: 2,
            borderDash: [10, 5], // Dashed line for S tier
            label: {
              content: 'S Tier',
              enabled: true,
              position: 'end',
              color: '#ff9800',
              backgroundColor: 'rgba(255, 152, 0, 0.5)',
              padding: 4,
              font: {
                size: 12,
              },
            },
          },
          aTierLine: {
            type: 'line',
            xMin: tierScores.aTierIndex,
            xMax: tierScores.aTierIndex,
            borderColor: '#CC52CE',
            borderWidth: 2,
            borderDash: [10, 5], // Dashed line for A tier
            label: {
              content: 'A Tier',
              enabled: true,
              position: 'end',
              color: '#CC52CE',
              backgroundColor: 'rgba(233, 30, 99, 0.5)',
              padding: 4,
              font: {
                size: 12,
              },
            },
          },
          bTierLine: {
            type: 'line',
            xMin: tierScores.bTierIndex,
            xMax: tierScores.bTierIndex,
            borderColor: '#00bcd4',
            borderWidth: 2,
            borderDash: [10, 5], // Dashed line for B tier
            label: {
              content: 'B Tier',
              enabled: true,
              position: 'end',
              color: '#00bcd4',
              backgroundColor: 'rgba(0, 188, 212, 0.5)',
              padding: 4,
              font: {
                size: 12,
              },
            },
          },
          cTierLine: {
            type: 'line',
            xMin: tierScores.cTierIndex,
            xMax: tierScores.cTierIndex,
            borderColor: '#4caf50',
            borderWidth: 2,
            borderDash: [10, 5], // Dashed line for C tier
            label: {
              content: 'C Tier',
              enabled: true,
              position: 'end',
              color: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.5)',
              padding: 4,
              font: {
                size: 12,
              },
            },
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(128, 128, 128,1)", // Màu trắng cho các nhãn tick trên trục X
          callback: function (value) {
            // Chỉ hiển thị các nhãn tại các chỉ mục tier boundary
            if (
              value === tierScores.sTierIndex ||
              value === tierScores.aTierIndex ||
              value === tierScores.bTierIndex ||
              value === tierScores.cTierIndex
            ) {
              return points[value]; // Hiển thị nhãn chỉ tại các điểm chỉ mục
            }
            return ''; // Ẩn tất cả các nhãn khác
          },
        },
        grid: {
          display: false, // Không hiển thị các đường grid
        },
        title: {
          display: true,
          text: 'Điểm', // Tiêu đề trục X
          color: "rgba(128, 128, 128,1)", // Màu trắng cho tiêu đề trục X
        },
        border: {
          color: "rgba(128, 128, 128,1)", // Màu trắng cho đường trục X
        },
        display: true, // Hiển thị trục X
      },
      y: {
        display: false, // Ẩn trục Y
      },
    }
    
  };
  if (loading) {
    return (
      <>
        <MyNavbar2 navigation={getNavigation()} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <MyNavbar2 navigation={getNavigation()} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="container mx-auto px-4 py-8 mt-40 ">
        <h2 className="text-3xl font-bold mb-6 text-center text-base-content">Bảng xếp hạng Pick'em Challenge</h2>
        <div className="container mx-auto flex xl:flex-row xl:gap-2 lg:gap-5 flex-col lg:mb-10">
          <div className="bg-base-100 w-full rounded-lg">
            {points.length > 0 && (
              <div className="xl:w-[100%] w-[98%] lg:h-[320px] h-[250px] mt-7 mx-auto">
                <Line data={prepareChartData()} options={{ ...chartOptions, maintainAspectRatio: false }} />
              </div>
            )}
          </div>
          <TierRewardsTable userScore={userRank ? userRank.score : 0} tierScores={tierScores} />
        </div>
        <div className="overflow-hidden">
          <table className="w-[98%] mx-auto">
            <tbody className="text-gray-600 text-sm font-light">
              {rankedLeaderboardData.slice(0, 20).map((user, index) => (
                <LeaderboardRow
                  className="last:!border-b-0"
                  key={user._id || `${user.rank}-${index}`}
                  user={user}
                  highlightUser={user.name === currentUser.username}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {userRank && (
  <div className="fixed bottom-0 w-full bg-black border-opacity-20 py-1 text-white flex items-center justify-between border-t-[0.1px] border-white">
    <div className="container mx-auto px-4">
      <table className="w-[98%] mx-auto">
        <tbody>
          <LeaderboardRow
            user={userRank}
            className="first:!border-t-0"
            isSticky={true}
            highlightUser={true}
            tierColor={
              userRank.score == maxScore
                ? '#D4AF37'
              :userRank.score >= tierScores.sTierScore
                ? '#ff9800' // S Tier
                : userRank.score >= tierScores.aTierScore
                ? '#CC52CE' // A Tier
                : userRank.score >= tierScores.bTierScore
                ? '#00bcd4' // B Tier
                : userRank.score >= tierScores.cTierScore
                ? '#4caf50' // C Tier
                : '#6A5ACD' // D Tier (below C tier)
            }
          />
        </tbody>
      </table>
    </div>
  </div>
)}
    </>
  );
};

export default LeaderboardComponent;

