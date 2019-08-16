export default (comment) => (
    
    comment.sort((a,b) => {
            return a.createdAt < b.createdAt ? 1 : -1; 
        }
    )
)