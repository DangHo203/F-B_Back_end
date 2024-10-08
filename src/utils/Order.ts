export const convertDay = (time: string) => {
    const now = new Date();
 
    if (time ==="One hour"){
        now.setHours(now.getHours() - 1);
        
        return now.toISOString().slice(0, 19).replace('T', ' ');
    }else if (time ==="One day"){
        now.setDate(now.getDate() - 1);
        
        return now.toISOString().slice(0, 19).replace('T', ' ');
    }else if (time ==="One week"){
        now.setDate(now.getDate() - 7);
        
        return now.toISOString().slice(0, 19).replace('T', ' ');
    }else if (time ==="One month"){
        now.setMonth(now.getMonth() - 1);
        
        return now.toISOString().slice(0, 19).replace('T', ' ');
    }
}