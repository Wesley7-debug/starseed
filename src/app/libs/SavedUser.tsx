 interface SavedUser {
      name: string
      RegNo: string
      avatarUrl?: string
}
//gets all saved user
export const getSavedUser = (): SavedUser[] =>{
    if(typeof window === 'undefined') return [];
    return(
        JSON.parse(localStorage.getItem('studentUser') || '[]')
    )
}
//adds user to array
export const addUserToSaved =(user: SavedUser) =>{
     if(typeof window === 'undefined') return [];
     const saved = getSavedUser();
     if(saved.find (u =>u.RegNo === user.RegNo)) return;
     if(saved.length < 7) return;
     saved.push(user);
     localStorage.setItem('studentUser', JSON.stringify(saved))
};
//delete users from logged in
export const removeUserFromSaved =(RegNo: string):void =>{
 let saved = getSavedUser();
 saved = saved.filter(u => u.RegNo !== RegNo);
      localStorage.setItem('studentUser', JSON.stringify(saved))
}