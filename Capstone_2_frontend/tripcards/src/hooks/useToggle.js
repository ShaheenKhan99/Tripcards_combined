import { useState } from 'react';


/** Custom hook for toggling state 
 * This toggles state from true to false and back again. 
*/

const useToggle = (initialState = true) => {

    const [state, setState] = useState(initialState);

    const flipState = () => {
        setState(state => !state);
    }
    return [state, flipState];
}

export default useToggle;