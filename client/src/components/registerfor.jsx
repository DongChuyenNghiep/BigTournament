import React, { useState } from "react";
import { FaPlus, FaMinus, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from 'axios';

const TeamRegistrationForm = () => {
    const [formData, setFormData] = useState({
        teamName: "",
        shortName: "",
        classTeam: "",
        logoUrl: "",
        games: [],
        gameMembers: {}
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null); // To show success or error messages

    const gameOptions = ["League Of Legends", "Valorant", "Teamfight Tactics", "FC Online"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleGameToggle = (game) => {
        let updatedGames = [...formData.games];
        let updatedGameMembers = { ...formData.gameMembers };

        if (updatedGames.includes(game)) {
            updatedGames = updatedGames.filter((g) => g !== game);
            delete updatedGameMembers[game];
        } else {
            updatedGames.push(game);
            // Show 5 inputs for "League Of Legends" and "Valorant", 1 for others
            updatedGameMembers[game] = (game === "League Of Legends" || game === "Valorant") ? Array(5).fill("") : [""];
        }

        setFormData({ ...formData, games: updatedGames, gameMembers: updatedGameMembers });
        validateField("games", updatedGames);
    };

    const handleMemberChange = (game, index, value) => {
        const updatedGameMembers = { ...formData.gameMembers };
        updatedGameMembers[game][index] = value;
        setFormData({ ...formData, gameMembers: updatedGameMembers });
        validateField("gameMembers", updatedGameMembers);
    };

    const addMember = (game) => {
        const updatedGameMembers = { ...formData.gameMembers };
        updatedGameMembers[game] = [...updatedGameMembers[game], ""];
        setFormData({ ...formData, gameMembers: updatedGameMembers });
    };

    const removeMember = (game, index) => {
        const updatedGameMembers = { ...formData.gameMembers };
        updatedGameMembers[game] = updatedGameMembers[game].filter((_, i) => i !== index);
        setFormData({ ...formData, gameMembers: updatedGameMembers });
        validateField("gameMembers", updatedGameMembers);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case "teamName":
                if (!value.trim()) {
                    newErrors.teamName = "Team name is required";
                } else {
                    delete newErrors.teamName;
                }
                break;
            case "shortName":
                if (!value.trim()) {
                    newErrors.shortName = "Short name is required";
                } else if (value.length > 5) {
                    newErrors.shortName = "Short name should not exceed 5 characters";
                } else {
                    delete newErrors.shortName;
                }
                break;
            case "classTeam":
                if (!value.trim()) {
                    newErrors.classTeam = "Class is required";
                } else {
                    delete newErrors.classTeam;
                }
                break;
            case "logoUrl":
                if (!value.trim()) {
                    newErrors.logoUrl = "Logo URL is required";
                }
                break;
            case "games":
                if (value.length === 0) {
                    newErrors.games = "Select at least one game";
                } else {
                    delete newErrors.games;
                }
                break;
            case "gameMembers":
                if (Object.values(value).some((members) => members.some((member) => !member.trim()))) {
                    newErrors.gameMembers = "All member fields must be filled";
                } else {
                    delete newErrors.gameMembers;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formFields = ["teamName", "shortName", "classTeam", "logoUrl", "games", "gameMembers"];
        let valid = true;

        // Validate all fields
        formFields.forEach((field) => {
            validateField(field, formData[field]);
            if (errors[field]) {
                valid = false;
            }
        });

        if (valid && Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('https://dongchuyennghiep-backend.vercel.app/api/auth/register', formData);
                console.log("Form submitted:", response.data);
                setSubmitStatus({ success: true, message: "Team registered successfully!" });

                // Reset form after successful submission
                setFormData({
                    teamName: "",
                    shortName: "",
                    classTeam: "",
                    logoUrl: "",
                    games: [],
                    gameMembers: {}
                });
                setErrors({});
            } catch (error) {
                console.error("Error submitting form:", error);
                if (error.response && error.response.data) {
                    setSubmitStatus({ success: false, message: error.response.data.message || "Submission failed." });
                } else {
                    setSubmitStatus({ success: false, message: "An unexpected error occurred." });
                }
            }
        } else {
            setSubmitStatus({ success: false, message: "Please fix the errors in the form." });
            console.log("Form has errors", errors);
        }
    };

    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
                <div className="relative px-4 py-8 sm:rounded-3xl sm:px-2 sm:py-12">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-bold text-center">Đơn đăng kí giải Esport DCN</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex flex-col">
                                    <label className="leading-loose font-semibold text-base-content" htmlFor="teamName">Tên đội</label>
                                    <input
                                        type="text"
                                        id="teamName"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleInputChange}
                                        className="px-4 py-2 border bg-white focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                        placeholder="Tên đội của bạn"
                                        aria-label="Team Name"
                                    />
                                    {errors.teamName && (
                                        <p className="text-red-500 text-xs italic" role="alert">{errors.teamName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="leading-loose font-semibold text-base-content" htmlFor="shortName">Tên viết tắt của đội</label>
                                    <input
                                        type="text"
                                        id="shortName"
                                        name="shortName"
                                        value={formData.shortName}
                                        onChange={handleInputChange}
                                        className="px-4 py-2 border bg-white focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                        placeholder="Tên viết tắt"
                                        aria-label="Team Short Name"
                                        maxLength="5"
                                    />
                                    {errors.shortName && (
                                        <p className="text-red-500 text-xs italic" role="alert">{errors.shortName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="leading-loose font-semibold text-base-content" htmlFor="classTeam">Team bạn là của lớp nào</label>
                                    <input
                                        type="text"
                                        id="classTeam"
                                        name="classTeam"
                                        value={formData.classTeam}
                                        onChange={handleInputChange}
                                        className="px-4 py-2 border bg-white focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                        placeholder="Lớp của team bạn đang học"
                                        aria-label="Class"
                                    />
                                    {errors.classTeam && (
                                        <p className="text-red-500 text-xs italic" role="alert">{errors.classTeam}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="leading-loose font-semibold text-base-content" htmlFor="logoUrl">Google Drive Logo URL của bạn</label>
                                    <input
                                        type="url"
                                        id="logoUrl"
                                        name="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={handleInputChange}
                                        className="px-4 py-2 bg-white border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                        placeholder="https://example.com/logo.png"
                                        aria-label="Team's Logo URL"
                                    />
                                    {errors.logoUrl && (
                                        <p className="text-red-500 text-xs italic" role="alert">{errors.logoUrl}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="leading-loose font-semibold text-base-content">Các game mà đội bạn sẽ tham gia</label>
                                    <div className="flex flex-wrap gap-2">
                                        {gameOptions.map((game) => (
                                            <motion.button
                                                key={game}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleGameToggle(game)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold ${formData.games.includes(game)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-200 text-gray-700"
                                                    }`}
                                                aria-pressed={formData.games.includes(game)}
                                            >
                                                {game}
                                            </motion.button>
                                        ))}
                                    </div>
                                    {errors.games && (
                                        <p className="text-red-500 text-xs italic" role="alert">{errors.games}</p>
                                    )}
                                </div>

                                {formData.games.map((game) => (
                                    <div key={game} className="flex flex-col mt-4">
                                        <label className="leading-loose text-base-content font-bold">Thành viên của game {game}</label>
                                        {formData.gameMembers[game].map((member, index) => (
                                            <div key={index} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={member}
                                                    onChange={(e) => handleMemberChange(game, index, e.target.value)}
                                                    className="px-4 py-2 border focus:ring-gray-500 focus:border-primary w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-white"
                                                    placeholder={`${game} Member ${index + 1} username`}
                                                    aria-label={`${game} Team Member ${index + 1}`}
                                                />

                                                {/* For LOL and Valorant, show the remove button only if members exceed 5 */}
                                                {(game === "League Of Legends" || game === "Valorant") && formData.gameMembers[game].length > 5 && (
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeMember(game, index)}
                                                        className="bg-red-500 text-white p-2 rounded-full"
                                                        aria-label={`Remove ${game} Member ${index + 1}`}
                                                    >
                                                        <FaMinus />
                                                    </motion.button>
                                                )}

                                                {/* For TFT and FC Online, show the remove button only if members exceed 1 */}
                                                {!(game === "League Of Legends" || game === "Valorant") && formData.gameMembers[game].length > 1 && (
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeMember(game, index)}
                                                        className="bg-red-500 text-white p-2 rounded-full"
                                                        aria-label={`Remove ${game} Member ${index + 1}`}
                                                    >
                                                        <FaMinus />
                                                    </motion.button>
                                                )}
                                            </div>
                                        ))}

                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addMember(game)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center mt-2"
                                            aria-label={`Add ${game} Team Member`}
                                        >
                                            <FaUserPlus className="mr-2" /> Add {game} Member
                                        </motion.button>
                                    </div>
                                ))}

                                {errors.gameMembers && (
                                    <p className="text-red-500 text-xs italic" role="alert">{errors.gameMembers}</p>
                                )}
                            </div>
                            <div className="pt-4 flex items-center space-x-4">
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                                >
                                    Register Team
                                </motion.button>
                            </div>
                        </form>

                        {submitStatus && (
                            <p className={`text-${submitStatus.success ? 'green' : 'red'}-500 text-xs italic`}>{submitStatus.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamRegistrationForm;