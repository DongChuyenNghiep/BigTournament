import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

export default function SwissStage() {
    const [data, setData] = useState(null);
    const [idmatch, setMatchId] = useState(null);
    const [loading, setLoading] = useState(true);
    const processSwissStageData = (data) => {
        let valueA = [];
        let valueB = [];
        let valueC = [];
        let valueD = [];
        let valueE = [];
        let valueF = [];
        let valueK = {};
        let valueL = [];
        let valueM = [];
        for (let i = 0; i < 8; i++) {
            valueA.push(data.table.rows[i]?.c[0]?.v ?? null);
            valueB.push(data.table.rows[i]?.c[1]?.v ?? null);
            valueC.push(data.table.rows[i]?.c[2]?.v ?? null);
            valueD.push(data.table.rows[i]?.c[3]?.v ?? null);
            valueE.push(data.table.rows[i]?.c[4]?.v ?? null);
            valueF.push(data.table.rows[i]?.c[5]?.v ?? null);
        }
        for (let i = 0; i < 4; i++) {
            valueK[data.table.rows[i]?.c[10]?.v ?? null] = data.table.rows[i]?.c[11]?.v ?? null;
        }
        for (let position in valueK) {
            valueL.push({ position: parseInt(position), logo: valueK[position] });
        }
        for (let i = 4; i < 8; i++) {
            valueM.push(data.table.rows[i]?.c[11]?.v ?? null);
        }

        function createTeamDiv(logoSrc, score) {
            const teamDiv = document.createElement('div');
            teamDiv.classList.add('team');

            const logoTeamDiv = document.createElement('div');
            logoTeamDiv.classList.add('logo-team');
            const logoImg = document.createElement('img');
            logoImg.src = logoSrc;
            logoImg.alt = '';
            logoTeamDiv.appendChild(logoImg);
            teamDiv.appendChild(logoTeamDiv);

            const scoreDiv = document.createElement('div');
            scoreDiv.classList.add('score');
            const scoreP = document.createElement('p');
            scoreP.textContent = score;
            scoreDiv.appendChild(scoreP);
            teamDiv.appendChild(scoreDiv);

            return teamDiv;
        }

        function createMatchup(i, valueA, valueB, containerClass, groupstage, idmatch) {
            const container = document.querySelector(containerClass);
            const matchupsContainer = document.createElement('div');
            matchupsContainer.classList.add('matchups');

            const link_info_match = document.createElement('a');
            link_info_match.classList.add('link-match-info');

            const matchupDiv = document.createElement('div');
            matchupDiv.classList.add('matchup');

            const regex = /\/d\/(.+?)\/view/;

            let link_drive_image_A = valueA[i];
            const fileIdA = link_drive_image_A.match(regex)[1];
            const logoSrcA = `https://drive.google.com/thumbnail?id=${fileIdA}`;
            const team1Div = createTeamDiv(logoSrcA, valueB[i]);
            matchupDiv.appendChild(team1Div);

            let link_drive_image_B = valueA[i + 1];
            const fileIdB = link_drive_image_B.match(regex)[1];
            const logoSrcB = `https://drive.google.com/thumbnail?id=${fileIdB}`;
            const team2Div = createTeamDiv(logoSrcB, valueB[i + 1]);
            matchupDiv.appendChild(team2Div);

            if (idmatch && Array.isArray(idmatch)) {
                const matchIndex = Math.floor(i / 2) + 1;
                const matchData = idmatch.find(match => match.round === groupstage && match.Match === `match${matchIndex}`);

                if (matchData) {
                    link_info_match.href = `/valorant/match/${groupstage}/${matchData.matchid}/${matchData.teamA}-${matchData.teamB}`;
                }
            } else {
                console.error("idmatch is not available or is not an array");
                link_info_match.href = `/valorant/match/${groupstage}/match${Math.floor(i / 2) + 1}`;
            }

            link_info_match.appendChild(matchupDiv);
            matchupsContainer.appendChild(link_info_match);
            container.appendChild(matchupsContainer);
        }

        // Only call createMatchup if idmatch is available
        if (idmatch) {
            for (let i = 0; i < 8; i += 2) {
                createMatchup(i, valueA, valueB, '.w0-l0', "round0-0", idmatch);
            }
            for (let i = 0; i < 4; i += 2) {
                createMatchup(i, valueC, valueD, '.w1-l0', "round1-0", idmatch);
            }
            for (let i = 4; i < 8; i += 2) {
                createMatchup(i, valueC, valueD, '.w0-l1', "round0-1", idmatch);
            }
            for (let i = 0; i < 3; i += 2) {
                createMatchup(i, valueE, valueF, '.w1-l1', "round1-1", idmatch);
            }
        }
        const eli = document.querySelector('.eliminate');
        const eliminateTeamsContainer = document.createElement('div');
        eliminateTeamsContainer.classList.add('eliminate-teams');

        // Create all-teams containeradvanceTeamsContainer
        const allTeamsContainerEli = document.createElement('div');
        allTeamsContainerEli.classList.add('all-teams-eli');

        // Loop through teams and create team elements
        valueM.forEach(teamName => {
            // Create team div
            const teamDiv = document.createElement('div');
            teamDiv.classList.add('team');

            // Create logo-team div
            const logoTeamDiv = document.createElement('div');
            logoTeamDiv.classList.add('logo-team');

            // Create team image
            const teamImg = document.createElement('img');
            const regex = /\/d\/(.+?)\/view/;
            let link_drive_image = teamName; // Use even value cell
            const logoteamA = link_drive_image.match(regex);
            const fileIdA = logoteamA[1];
            teamImg.src = `https://drive.google.com/thumbnail?id=${fileIdA}`;
            teamImg.alt = '';

            // Append team image to logo-team div
            logoTeamDiv.appendChild(teamImg);

            // Append logo-team div to team div
            teamDiv.appendChild(logoTeamDiv);

            // Append team div to all-teams container
            allTeamsContainerEli.appendChild(teamDiv);
        });

        // Append all-teams container to eliminate-teams container
        eliminateTeamsContainer.appendChild(allTeamsContainerEli);

        // Append eliminate-teams container to the document body or any other desired parent element
        eli.appendChild(eliminateTeamsContainer);


        const adva = document.querySelector('.advance');
        const advanceTeamsContainer = document.createElement('div');
        advanceTeamsContainer.classList.add('advance-teams');

        // Create all-teams-win container
        const allTeamsWinContainer = document.createElement('div');
        allTeamsWinContainer.classList.add('all-teams-win');


        // Loop through teamsData and create team elements
        valueL.forEach(team => {
            // Create team div
            const teamDiv = document.createElement('div');
            teamDiv.classList.add('team');

            // Create position div
            const posDiv = document.createElement('div');
            posDiv.classList.add('pos');
            const posP = document.createElement('p');
            posP.textContent = team.position;
            posDiv.appendChild(posP);

            // Create logo-team div
            const logoTeamDiv = document.createElement('div');
            logoTeamDiv.classList.add('logo-team');

            // Create team image
            const teamImg = document.createElement('img');
            const regex = /\/d\/(.+?)\/view/;
            let link_drive_image = team.logo; // Use even value cell
            const logoteamA = link_drive_image.match(regex);
            const fileIdA = logoteamA[1];
            teamImg.src = `https://drive.google.com/thumbnail?id=${fileIdA}`;
            teamImg.alt = '';


            // Append elements to team div
            teamDiv.appendChild(posDiv);
            logoTeamDiv.appendChild(teamImg);
            teamDiv.appendChild(logoTeamDiv);

            // Append team div to all-teams-win container
            allTeamsWinContainer.appendChild(teamDiv);
        });

        // Append all-teams-win container to advance-teams container
        advanceTeamsContainer.appendChild(allTeamsWinContainer);

        // Append advance-teams container to the document body or any other desired parent element
        adva.appendChild(advanceTeamsContainer);
        setData(data);
    };

    useEffect(() => {
        document.title = 'Vòng Swiss Play';

        const fetchGames = async () => {
            try {
                const response = await fetch('/api/auth/findallmatchid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMatchId(data);
            } catch (error) {
                console.error("Failed to fetch games:", error);
            }
        };

        fetchGames();

        const SHEET_ID = '1s2Lyk37v-hZcg7-_ag8S1Jq3uaeRR8u-oG0zviSc26E';
        const sheets = [
            { title: 'Swiss Stage', range: 'A2:L53', processData: processSwissStageData }
        ];

        const fetchAllSheetData = async () => {
            try {
                setLoading(true); // Set loading to true before fetching data
                for (const sheet of sheets) {
                    const sheetData = await fetchSheetData(sheet.title, sheet.range);
                    sheet.processData(sheetData);
                }
            } catch (error) {
                console.error("Failed to fetch sheet data:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchAllSheetData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>; // Show loading while data is being fetched
    }
    
    useEffect(() => {
        if (idmatch && data) {
            processSwissStageData(data);
        }
    }, [idmatch, data]);
    
    return (
        <>
            <div className="next">
                <Link to="/valorant/playoff">Play-off &gt;</Link>
            </div>
            <h2 style={{ textAlign: 'center', fontWeight: 900 }}>SWISS STAGE</h2>
            <section className="swissbracket">
                <div className="vong1">
                    <div className="matchuppair">
                        <div className="w0-l0">
                            <div className="title">
                                <p className="title-vong-1 text-white">0W - 0L</p>
                            </div>
                        </div>
                    </div>
                    <div className="connection-line">
                        <div className="line"></div>
                        <div className="merger"></div>
                    </div>
                </div>

                <div className="vong2">
                    <div className="matchuppair">
                        <div className="w1-l0">
                            <div className="title">
                                <p className="title-vong-2 text-white">1W - 0L</p>
                            </div>
                        </div>
                        <div className="w0-l1">
                            <div className="title">
                                <p className="title-vong-2 text-white">0W - 1L</p>
                            </div>
                        </div>
                    </div>
                    <div className="connection-line">
                        <div className="adv-line">
                            <div className="line"></div>
                        </div>
                        <div className="connection1 border-primary">
                            <div className="merger"></div>
                            <div className="line "></div>
                        </div>
                        <div className="eli-line">
                            <div className="line"></div>
                        </div>
                    </div>
                </div>

                <div className="vong3">
                    <div className="matchuppair">
                        <div className="w1-l1">
                            <div className="title">
                                <p className="title-vong-3 text-white">1W - 1L</p>
                            </div>
                        </div>
                    </div>
                    <div className="connection1">
                        <div className="line"></div>
                    </div>
                    <div className="eli-line">
                        <div className="line"></div>
                    </div>
                </div>

                <div className="adva-eli">
                    <div className="teams">
                        <div className="advance">
                            <div className="title">
                                <p className="title-advance text-white">Advance to play-off</p>
                            </div>
                        </div>
                        <div className="eliminate">
                            <div className="title">
                                <p className="title-eliminate text-white">Eliminate</p>
                            </div>
                            <div className="eliminate-teams"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}