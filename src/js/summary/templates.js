/**
 * Returns the html element for the low priority icon
 * @returns {HTMLString} - Element for the low priority
 */
function createLowPriority() {
    return `<i class='bx bx-chevrons-down low'></i>`
}

/**
 * Returns thehtml element for the urgent priority icon
 * @returns {HTMLString} - Element for the urgent priority
 */
function createUrgentPriority() {
    return `<i class='bx bx-chevrons-up urgent'></i>`
}

/**
 * Returns a container with two minus icons for medium priority
 * @returns {HTMLString} - Element for the medium priority
 */
function createMediumPriority() {
    return `<div class="medium_container flex-column">
    <i class='bx bx-minus medium upper_minus'></i>
    <i class='bx bx-minus medium lower_minus'></i></div>`
}