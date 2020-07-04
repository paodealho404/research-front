const Auth = {
    authenticate_number(value) {
        return value != null;
    },
    authenticate_string(value) {
        return value.length !== 0;
    },
    authenticate_participant(participant) {      
        if (participant.hasOwnProperty('id') && participant.hasOwnProperty('gender') && participant.hasOwnProperty('age') && participant.hasOwnProperty('educational_level') && participant.hasOwnProperty('state') && participant.hasOwnProperty('technical_level') && participant.hasOwnProperty('dashboard_sequence') && participant.hasOwnProperty('favorite_dashboard')) {
            if (this.authenticate_number(participant.id) && this.authenticate_string(participant.gender) && this.authenticate_string(participant.age) && this.authenticate_string(participant.educational_level) && this.authenticate_string(participant.state) && this.authenticate_string(participant.technical_level) && this.authenticate_number(participant.dashboard_sequence) && this.authenticate_number(participant.favorite_dashboard)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    authenticate_survey(survey) {
        if (survey.hasOwnProperty('participant_id') && survey.hasOwnProperty('q1') && survey.hasOwnProperty('q2') && survey.hasOwnProperty('q3') && survey.hasOwnProperty('q4') && survey.hasOwnProperty('q5') && survey.hasOwnProperty('q6') && survey.hasOwnProperty('q7') && survey.hasOwnProperty('q8') && survey.hasOwnProperty('q9') && survey.hasOwnProperty('survey_type')) {
            if (this.authenticate_number(survey.participant_id) && this.authenticate_string(survey.q1) && this.authenticate_string(survey.q2) && this.authenticate_string(survey.q3) && this.authenticate_string(survey.q4) && this.authenticate_string(survey.q5) && this.authenticate_string(survey.q6) && this.authenticate_string(survey.q7) && this.authenticate_string(survey.q8) && this.authenticate_string(survey.q9) && this.authenticate_number(survey.survey_type)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
};

export default Auth;