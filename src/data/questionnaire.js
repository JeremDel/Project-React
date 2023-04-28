
import firebaseApp from '../initFirebase';

const questionnaireBackup = {
  themes: [
    {
      name: "Physical activity",
      type: "Flow",
      radarName: "Physical activity",
      defaultPoints: 1,
      defaultRecommendation: "We encourage you to consider getting back into physical activity. Regular physical activity is essential for good health and independence.",
      maxPoints: 6,
      questions: [
        {
          id: "q1",
          label: "Do you engage in regular physical activity? ",
          answers: [
            {
              label: "Yes",
              goto: "q2"
            },
            {
              label: "No",
              goto: "q4"
            },
          ],
        },
        {
          id: "q2",
          label:
            "Would you say you are active for at least 30 minutes each day (at least 5 days a week)?",
          answers: [
            {
              label: "Yes",
              goto: "q3"
            },
            {
              label: "No",
              points: 4,
              recommendation:
                "It sounds like the intensity you put into your sport is too low. The next time you train, try to increase it.",
            },
          ],
        },
        {
          id: "q3",
          label:
            "Do you sometimes/regularly get sweaty or out of breath during this activity?",
          answers: [
            {
              label: "Yes",
              points: 6,
              recommendation:
                "It is very good, you are active at least 30 minutes a day 5 days a week. Keep it up!",
            },
            {
              label: "No",
              points: 5,
              recommendation: {
                text: "It sounds like the intensity you put into your sport is too low. The next time you train, try increasing it. Here are some links to help you.",
                brochure: [
                  {
                    label: "hepa.ch",
                    link: "https://www.hepa.ch/fr/bewegungsempfehlungen.html",
                  },
                  {
                    label: "unisante.ch",
                    link: "https://www.unisante.ch/fr/promotion-prevention/activite-physique",
                  },
                ],
              },
            },
          ],
        },
        {
          id: "q4",
          label:
            "Would you like to resume more physical activity in the next few months?",
          answers: [
            {
              label: "Yes",
              points: 3,
              recommendation: {
                text: "Here are some useful links to help you get back into physical activity gently.",
                brochure: [
                  {
                    label: "concordia.ch",
                    link: "https://www.concordia.ch/fr/magazin/jeden-tag-sport.html",
                  },
                  {
                    label: "unisante.ch",
                    link: "https://www.unisante.ch/fr/promotion-prevention/activite-physique",
                  },
                ],
              },
            },
            {
              label: "No",
              goto: "q5"
            },
          ],
        },
        {
          id: "q5",
          label:
            "Do you know the health benefits of physical activity?",
          answers: [
            {
              label: "Yes",
              points: 2,
              recommendation: "We encourage you to consider getting back into physical activity.",
              goto: "q6"
            },
            {
              label: "No",
              goto: "q6"
            },
          ],
        },
        {
          id: "q6",
          label: "Do you know the risks of inactivity?",
          answers: [
            {
              label: "Yes",
              points: 2,
              recommendation: "We encourage you to consider getting back into physical activity."
            },
            {
              label: "No"
            },
          ],
        }
      ],
    },
    {
      name: "Walking aids",
      maxPoints: 5,
      type: "Single",
      radarName: "Walking without aids",
      questions: [
        {
          label: "What walking aids do you use?",
          answers: [
            {
              label: "No",
              points: 5,
            },
            {
              label: "A cane",
              points: 4,
            },
            {
              label: "Two canes",
              points: 3,
            },
            {
              label: "Walker",
              points: 2,
            },
            {
              label: "Walking frame",
              points: 2,
            },
            {
              label: "I need the help of a third person",
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: "Walking speed",
      maxPoints: 5,
      type: "Single",
      radarName: "Walking speed",
      info: "Choose one answer",
      questions: [
        {
          label:
            "Compared to the average walking speed (that of your family, friends and people your age), do you think you walk about...",
          answers: [
            {
              label: "Slightly slower",
              points: 1,
              recommendation: "Suggestion: Increase the indicated time by 30%.",
            },
            {
              label: "A little slower",
              points: 2,
              recommendation: "Suggestion: Increase the indicated time by 10%.",
            },
            {
              label: "At the same speed",
              points: 3,
              recommendation:
                "Suggestion: You do not need to increase or reduce the indicated time.",
            },
            {
              label: "A little faster",
              points: 4,
              recommendation: "Suggestion: Reduce the indicated time by 10%.",
            },
            {
              label: "Significantly faster",
              points: 5,
              recommendation: "Suggestion: Reduce the indicated time by 20%.",
            },
          ],
        },
      ],
    },
    {
      name: "Walking time",
      maxPoints: 60,
      type: "Single",
      radarName: "Walking time",
      info: "Choose the maximum time you think you can maintain at the following paces easily, on level ground and without stopping to rest:",
      questions: [
        {
          label:
            "Walk slowly (slower than your family, friends or people your age)",
          answers: [
            {
              label: "Impossible",
              points: 0,
              recommendation: "No walking.",
            },
            {
              label: "1 minute",
              points: 1,
              recommendation: "No walking.",
            },
            {
              label: "5 minutes",
              points: 4,
              recommendation: "Walking time: 5 minutes.",
            },
            {
              label: "15 minutes",
              points: 7,
              recommendation: "Walking time: 15 minutes.",
            },
            {
              label: "30 minutes",
              points: 10,
              recommendation: "Walking time: 30 minutes.",
            },
            {
              label: "1 hour",
              points: 13,
              recommendation: "Walking time: 1 hour.",
            },
            {
              label: "2 hours",
              points: 16,
              recommendation: "Walking time: 2 hours.",
            },
            {
              label: "3 hours and more",
              points: 19,
              recommendation: "Walking time: 3 hours.",
            },
          ],
        },
        {
          label:
            "Walk at an average speed (the same speed as your family, friends or people your age)",
          answers: [
            {
              label: "Impossible",
              points: 0,
            },
            {
              label: "1 minute",
              points: 2,
            },
            {
              label: "5 minutes",
              points: 5,
            },
            {
              label: "15 minutes",
              points: 8,
            },
            {
              label: "30 minutes",
              points: 11,
            },
            {
              label: "1 hour",
              points: 14,
            },
            {
              label: "2 hours",
              points: 17,
            },
            {
              label: "3 hours and more",
              points: 20,
            },
          ],
        },
        {
          label:
            "Walk fast (faster than your family, friends or people your age)",
          answers: [
            {
              label: "Impossible",
              points: 0,
            },
            {
              label: "1 minute",
              points: 3,
            },
            {
              label: "5 minutes",
              points: 6,
            },
            {
              label: "15 minutes",
              points: 9,
            },
            {
              label: "30 minutes",
              points: 12,
            },
            {
              label: "1 hour",
              points: 15,
            },
            {
              label: "2 hours",
              points: 18,
            },
            {
              label: "3 hours and more",
              points: 21,
            },
          ],
        },
      ],
    },
    {
      name: "Go up",
      type: "Single",
      maxPoints: 27,
      radarName: "Ability to climb",
      Info: "Stair climbing: Record the degree of physical difficulty that best describes how difficult it was for you to climb stairs, without stopping to rest, during the past week.",
      questions: [
        {
          label: "Climb 1 floor ? Degree of difficulty",
          answers: [
            {
              label: "None",
              points: 4,
            },
            {
              label: "Light",
              points: 3,
            },
            {
              label: "Medium",
              points: 2,
            },
            {
              label: "Important",
              points: 1,
            },
            {
              label: "Unfeasible",
              points: 0,
            },
          ],
        },
        {
          label: "Climb 3 floors ? Degree of difficulty",
          answers: [
            {
              label: "None",
              points: 9,
            },
            {
              label: "Light",
              points: 8,
            },
            {
              label: "Medium",
              points: 7,
            },
            {
              label: "Important",
              points: 6,
            },
            {
              label: "Unfeasible",
              points: 5,
            },
          ],
        },
        {
          label: "Climb 5 floors ? Degree of difficulty",
          answers: [
            {
              label: "None",
              points: 14,
            },
            {
              label: "Light",
              points: 13,
            },
            {
              label: "Medium",
              points: 12,
            },
            {
              label: "Important",
              points: 11,
            },
            {
              label: "Unfeasible",
              points: 10,
            },
          ],
        },
      ],
      recommendations: [
        {
          recommendation: "No elevation possible.",
          minPoint: 0,
        },
        {
          recommendation: "Only very small differences in elevation possible.",
          minPoint: 1,
        },
        {
          recommendation: "Only slight to moderate elevation changes possible.",
          minPoint: 6,
        },
        {
          recommendation: "Moderate differences in elevation possible.",
          minPoint: 11,
        },
        {
          recommendation: "Moderate differences in elevation possible.",
          minPoint: 13,
        },
      ],
    },
    {
      name: "Security walk",
      maxPoints: 5,
      type: "Single",
      radarName: "Insecurity walk",
      questions: [
        {
          label: "Are you afraid of falling?",
          answers: [
            {
              label: "Yes,I am afraid to fall",
              points: 1,
            },
            {
              label: "No, I am not afraid to fall",
              points: 0,
            },
          ],
        },
        {
          label: "Have you fallen in the last 12 months?",
          answers: [
            {
              label: "No",
              points: 0,
            },
            {
              label: "Once",
              points: 1,
            },
            {
              label: "Twice",
              points: 2,
            },
            {
              label: "Several times",
              points: 3,
            },
          ],
        },
        {
          label: "Do you sometimes feel dizzy?",
          answers: [
            {
              label: "Yes",
              points: 1,
            },
            {
              label: "No",
              points: 0,
            },
          ],
        },
      ],
      recommendations: [
        {
          recommendation:
            "No problems with balance or risk of falls. No suggestions necessary.",
          minPoint: 0,
        },
        {
          recommendation:
            "You can take trails without too many difficulties (risk of falls) and guided hikes.",
          minPoint: 1,
        },
        {
          recommendation: "You can take simples trails and guided hikes.",
          minPoint: 2,
        },
      ],
    },
    {
      maxPoints: 1,
      name: "Fear of the void",
      type: "Single",
      radarInversePoints: true,
      radarName: "Not afraid of the void",
      info: "Explanation: Fear of heights is a real phobia (phobia = fear) and is not to be confused with vertigo, which is a physiological phenomenon). The fear of heights can be triggered by the simple thought of being in height.",
      questions: [
        {
          label: "Are you afraid of heights (Fear of heights)?",
          answers: [
            {
              label: "Yes",
              points: 1,
              recommendation: "Not exposed roads to the void.",
            },
            {
              label: "No",
              points: 0,
              recommendation: "Exposed roads to the void possible.",
            },
          ],
        },
      ],
    },
    {
      maxPoints: 2,
      name: "Balance",
      type: "Single",
      radarName: "Balance",
      questions: [
        {
          label:
            "Do you feel confident when you stand on one leg without holding onto something?",
          answers: [
            {
              label: "No, I don't feel safe",
              points: 1,
            },
            {
              label: "Yes, I feel safe",
              points: 2,
            },
            {
              label: "Impossible to do it without holding me",
              points: 0,
            },
          ],
        },
      ],
    },
    {
      maxPoints: 5,
      name: "Pain",
      type: "Multiple",
      radarInversePoints: true,
      radarName: "Painless",
      questions: [
        {
          label: "Do you have any pain?",
          answers: [
            {
              label: "Hip pain",
              points: 1,
            },
            {
              label: "Knee pain",
              points: 1,
            },
            {
              label: "Foot pain",
              points: 1,
            },
            {
              label: "Back pain",
              points: 1,
            },
            {
              label: "Pain elsewhere",
              points: 1,
            },
            {
              label: "No pain",
              points: 0,
              exclusive: true,
            },
          ],
        },
      ],
    },
    {
      maxPoints: 3,
      name: "Mobility",
      type: "Multiple",
      radarInversePoints: true,
      radarName: "Mobility",
      questions: [
        {
          label:
            "Do you have mobility problems in one or more of the following joints?",
          answers: [
            {
              label: "Yes, I have reduced mobility in my ankle",
              points: 1,
            },
            {
              label: "Yes, my knee has reduced mobility",
              points: 1,
            },
            {
              label: "Yes, my hip has reduced mobility",
              points: 1,
            },
            {
              label: "No, no mobility problems",
              points: 0,
              exclusive: true,
            },
          ],
        },
      ],
    },
  ],
};

function getQuestionnaire() {
  return new Promise((resolve, reject) => {

    const myDoc = firebaseApp.firestore().collection('questionnaires').doc('default');
    myDoc.get().then((doc) => {
      if(doc.exists){
        // Update the questionnaires and store them in the document
        return resolve(doc.data());
      } 
      
      reject('Could not find questionnaire in firebase (1)')
    })
    .catch(() => {
      reject('Could not find questionnaire in firebase (2)')
    });
  });
}


export default getQuestionnaire;
