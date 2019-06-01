function quizTitles(e) {

    window.location.href="#quiz_titles";

    /* need to stop the form sending of the form

     UPDATE as comment: This may not be exactly correct syntax
     for stopping a form , look up preventing form submission */

    e.preventDefault();
    e.stopPropagation();

}