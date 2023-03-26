const questionnaire = {
    "themes" : [
        {
            "name": "Physical activity",
            "questions": [
                {
                    "libelle" : "Do you engage in regular physical activity? ",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 0},
                        {"libelle" : "No", "Points" : 0}
                    ]
                },
                {
                    "libelle" : "Would you say you are active for at least 30 minutes each day (at least 5 days a week)?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 0},
                        {"libelle" : "No", "Points" : 4}
                    ]
                },
                {
                    "libelle" : "Do you sometimes/regularly get sweaty or out of breath during this activity?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 6},
                        {"libelle" : "No", "Points" : 5}
                    ]
                },
                {
                    "libelle" : "Would you like to resume more physical activity in the next few months?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 3},
                        {"libelle" : "No", "Points" : 0}
                    ]
                },
                {
                    "libelle" : "Do you know the health benefits of physical activity?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 0},
                        {"libelle" : "No", "Points" : 0}
                    ]
                },
                {
                    "libelle" : "Do you know the risks of inactivity?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 0},
                        {"libelle" : "No", "Points" : 0}
                    ]
                }
            ]
        },
        {
            "name": "Walking without aids ",
            "questions": [
                {
                    "libelle" : "What walking aids do you use?",
                    "answers"  : [
                        {"libelle" : "No", "Points" : 5},
                        {"libelle" : "A cane", "Points" : 4},
                        {"libelle" : "Two canes", "Points" : 3},
                        {"libelle" : "Walker", "Points" : 2},
                        {"libelle" : "Walking frame", "Points" : 2},
                        {"libelle" : "I need the help of a third person", "Points" : 1}
                    ]
                }
            ]
        },
        {
            "name": "Walking speed",
            "questions": [
                {
                    "libelle" : "Compared to the average walking speed (that of your family, friends and people your age), do you think you walk about... (check one)",
                    "answers"  : [
                        {"libelle" : "Slightly slower", "Points" : 1},
                        {"libelle" : "A little slower", "Points" : 2},
                        {"libelle" : "At the same speed", "Points" : 3},
                        {"libelle" : "A little faster", "Points" : 4},
                        {"libelle" : "Significantly faster", "Points" : 5}
                    ]
                }
            ]
        },
        {
            "name": "Walking time",
            "info" : "Circle the maximum time you think you can maintain at the following paces easily, on level ground and without stopping to rest:",
            "questions": [
                {
                    "libelle" : "Walk slowly (slower than your family, friends or people your age)",
                    "answers"  : [
                        {"libelle" : "Impossible", "Points" : 0},
                        {"libelle" : "1 minute", "Points" : 1},
                        {"libelle" : "5 minutes", "Points" : 4},
                        {"libelle" : "15 minutes", "Points" : 7},
                        {"libelle" : "30 minutes", "Points" : 10},
                        {"libelle" : "1 hour", "Points" : 13},
                        {"libelle" : "2 hours", "Points" : 16},
                        {"libelle" : "3 hours and more", "Points" : 19}
                    ]
                },
                {
                    "libelle" : "Walk at an average speed (the same speed as your family, friends or people your age)",
                    "answers" : [
                        {"libelle" : "Impossible", "Points" : 0},
                        {"libelle" : "1 minute", "Points" : 2},
                        {"libelle" : "5 minutes", "Points" : 5},
                        {"libelle" : "15 minutes", "Points" : 8},
                        {"libelle" : "30 minutes", "Points" : 11},
                        {"libelle" : "1 hour", "Points" : 14},
                        {"libelle" : "2 hours", "Points" : 17},
                        {"libelle" : "3 hours and more", "Points" : 20}
                    ]
                },
                {
                    "libelle" : "Walk fast (faster than your family, friends or people your age)",
                    "answers" : [
                        {"libelle" : "Impossible", "Points" : 0},
                        {"libelle" : "1 minute", "Points" : 3},
                        {"libelle" : "5 minutes", "Points" : 6},
                        {"libelle" : "15 minutes", "Points" : 9},
                        {"libelle" : "30 minutes", "Points" : 12},
                        {"libelle" : "1 hour", "Points" : 15},
                        {"libelle" : "2 hours", "Points" : 18},
                        {"libelle" : "3 hours and more", "Points" : 21}
                    ]
                }
            ]
        },
        {
            "name": "Ability to climb",
            "Info" : "Stair climbing: Record the degree of physical difficulty that best describes how difficult it was for you to climb stairs, without stopping to rest, during the past week.",
            "questions": [
                {
                    "libelle" : "Climb 1 floor ? Degree of difficulty",
                    "answers"  : [
                        {"libelle" : "None", "Points" : 4},
                        {"libelle" : "Light", "Points" : 3},
                        {"libelle" : "Medium", "Points" : 2},
                        {"libelle" : "Important", "Points" : 1},
                        {"libelle" : "Unfeasible", "Points" : 0}
                    ]
                },
                {
                    "libelle" : "Climb 3 floors ? Degree of difficulty",
                    "answers" : [
                        {"libelle" : "None", "Points" : 9},
                        {"libelle" : "Light", "Points" : 8},
                        {"libelle" : "Medium", "Points" : 7},
                        {"libelle" : "Important", "Points" : 6},
                        {"libelle" : "Unfeasible", "Points" : 5}
                    ]
                },
                {
                    "libelle" : "Climb 5 floors ? Degree of difficulty",
                    "answers" : [
                        {"libelle" : "None", "Points" : 14},
                        {"libelle" : "Light", "Points" : 13},
                        {"libelle" : "Medium", "Points" : 12},
                        {"libelle" : "Important", "Points" : 11},
                        {"libelle" : "Unfeasible", "Points" : 10}
                    ]
                }
            ]
        },
        {
            "name": "Insecurity walk",
            "questions": [
                {
                    "libelle" : "Are you afraid of falling?",
                    "answers"  : [
                        {"libelle" : "Yes,I am afraid to fall", "Points" : 1},
                        {"libelle" : "No, I am not afraid to fall", "Points" : 0}
                    ]
                },
                {
                    "libelle" : "Have you fallen in the last 12 months?",
                    "answers" : [
                        {"libelle" : "No", "Points" : 0},
                        {"libelle" : "Once", "Points" : 1},
                        {"libelle" : "Twice", "Points" : 2},
                        {"libelle" : "Several times", "Points" : 3}
                    ]
                },
                {
                    "libelle" : "Do you sometimes feel dizzy?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 1},
                        {"libelle" : "No", "Points" : 0}
                    ]
                }
            ]
        },

        {
            "name": "Fear of the void",
            "info" : "Explanation: Fear of heights is a real phobia (phobia = fear) and is not to be confused with vertigo, which is a physiological phenomenon). The fear of heights can be triggered by the simple thought of being in height.",
            "questions": [
                {
                    "libelle" : "Are you afraid of heights (Fear of heights)?",
                    "answers" : [
                        {"libelle" : "Yes", "Points" : 1},
                        {"libelle" : "No", "Points" : 0}
                    ]
                }
            ]
        },

        {
            "name": "Balance",
            "type": "singleChoice",
            "questions": [
                {
                    "libelle" : "Do you feel confident when you stand on one leg without holding onto something?",
                    "answers" : [
                        {"libelle" : "No, I don't feel safe", "Points" : 1},
                        {"libelle" : "Yes, I feel safe", "Points" : 2},
                        {"libelle" : "Impossible to do it without holding me", "Points" : 0}
                    ]
                }
            ]
        },

        {
            "name": "Painless",
            "type": "multipleChoice",
            "questions": [
                {
                    "libelle" : "Do you have any pain?",
                    "answers" : [
                        {"libelle" : "Hip pain", "Points" : 1},
                        {"libelle" : "Knee pain", "Points" : 1},
                        {"libelle" : "Foot pain", "Points" : 1},
                        {"libelle" : "Back pain", "Points" : 1},
                        {"libelle" : "Pain elsewhere", "Points" : 1},
                        {"libelle" : "No pain", "Points" : 0}
                    ]
                }
            ]
        },
        {
            "name": "Mobility",
            "type": "multipleChoice",
            "questions": [
                {
                    "libelle" : "Do you have mobility problems in one or more of the following joints?",
                    "answers" : [
                        {"libelle" : "Yes, I have reduced mobility in my ankle", "Points" : 1},
                        {"libelle" : "Yes, my knee has reduced mobility", "Points" : 1},
                        {"libelle" : "Yes, my hip has reduced mobility", "Points" : 1},
                        {"libelle" : "No, no mobility problems", "Points" : 0}
                    ]
                }
            ]
        }
    ]
};

export default questionnaire;