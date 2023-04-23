const userQuestionnaire = {
    "uid": "UID1",
    "themes": [
      {
        "name": "Physical activity",
        "radarName": "Physical activity",
        "questions": [
          {
            "label": "Do you engage in regular physical activity? ",
            "answers": [
              {
                "label": "Yes"
              }
            ]
          }
        ],
        "recommendations": [
            ""
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Walking aids",
        "radarName": "Walking without aids",
        "questions": [
          {
            "label": "What walking aids do you use?",
            "answers": [
              {
                "label": "A cane"
              }
            ]
          }
        ],
        "recommendations": [
            "Whatecver"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Walking speed",
        "type": "Single",
        "radarName": "Walking speed",
        "questions": [
        ],
        "recommendations": [
            "Whatecver"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Walking time",
        "type": "Single",
        "radarName": "Walking time",
        "info": "Choose the maximum time you think you can maintain at the following paces easily, on level ground and without stopping to rest:",
        "questions": [
        ],
        "recommendations": [
            "Whatecver"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Go up",
        "type": "Single",
        "radarName": "Ability to climb",
        "Info": "Stair climbing: Record the degree of physical difficulty that best describes how difficult it was for you to climb stairs, without stopping to rest, during the past week.",
        "questions": [

        ],
        "recommendations": [
          "No elevation possible"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Security walk",
        "type": "Single",
        "radarName": "Insecurity walk",
        "questions": [
        ],
        "recommendations": [
          "No problems with balance or risk of falls; no suggestions necessary"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Fear of the void",
        "type": "Single",
        "radarName": "Not afraid of the void",
        "info": "Explanation: Fear of heights is a real phobia (phobia = fear) and is not to be confused with vertigo, which is a physiological phenomenon). The fear of heights can be triggered by the simple thought of being in height.",
        "questions": [
        
        ],
        "recommendations": [
            "No problems with balance or risk of falls; no suggestions necessary"
          ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Balance",
        "type": "Single",
        "radarName": "Balance",
        "questions": [
        ],
        "recommendations": [
            "No problems with balance or risk of falls; no suggestions necessary"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Pain",
        "type": "Multiple",
        "radarName": "Painless",
        "questions": [],
        "recommendations": [
            "No problems with balance or risk of falls; no suggestions necessary"
        ],
        "points": 5,
        "maxPoints": 50
      },
      {
        "name": "Mobility",
        "type": "Multiple",
        "radarName": "Mobility",
        "questions": [],
        "recommendations": [
            "No problems with balance or risk of falls; no suggestions necessary"
        ],
        "points": 5,
        "maxPoints": 50
      }
    ]
  }
  ;

export default userQuestionnaire;