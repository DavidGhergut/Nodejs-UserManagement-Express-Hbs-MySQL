const activate = async (toggle_button) => {
    let td = toggle_button.parentElement;
    let tr = td.parentElement;
    let userId = tr.dataset['userid'];
    let status = tr.dataset['userstatus'];

    await fetch('/activate-user/' + userId, {method: 'POST'});

    let newStatus;

    // this if toggles the status button between "active" and "none"
    if (status === "none")
        newStatus = 'active';
    else
        newStatus = 'none';

    tr.dataset['userstatus'] = newStatus;

    // this if toggles the text of the status button between "activate" and "deactivate"
    if (newStatus === 'active')
        toggle_button.querySelector('span.button-activate').innerText = 'deactivate';
    else
        toggle_button.querySelector('span.button-activate').innerText = 'activate';
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('button.activate-button')
        .forEach(toggle_button => {
            toggle_button.addEventListener('click', () => {
                activate(toggle_button)
            });
        })
});