import {db} from "../libs/db.js"
const  getAllPlayListDetails = async (req,res) => {

    try {
        const userId = req.user.id;

        // find all playlist details 
        const playlists = await db.playlist.findMany({
            where:{
                userId:userId
            },

            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        });

        res.status(200).json({
            success:true,
            message:"Here is your All PlayList",
            data:playlists
        })
    } catch (error) {
        console.log(`error ${error}`)
        res.status(500).json({
            success:false,
            message:"Internal server error "
        });
    }
    
}

const getPlayListDetails = async (req,res) => {

    const {playlistId} = req.params;
    const userId = req.user.id;

    try {

        const playList = await  db.playlist.findUnique({
            where:{
                id:playlistId,
                userId:userId
            },
            include:{
                problems:{
                    include:{
                        problem:true,
                    }
                }
            }
        });

        if(!playList){
            return res.status(409).json({
                success:false,
                message:"no playlist found",
            })
        }

        res.status(200).json({
            success:true,
            message:"here is your Playlist",
            data:playList
        })
        
    } catch (error) {
     console.log(`error ${error}`)
        res.status(500).json({
            success:false,
            message:"Internal server error "
        });
    }



    
}

const createPlayList = async (req,res) => {

    
    const {title,description} = req.body;
    const userId = req.user.id;

    try {
        
        const playList = await db.playlist.create({
            data:{
                title,
                description,
                userId
            }
        });

       

        res.status(201).json({
            success:true,
            message:"PlayList created successfully",
            data:playList
        })

        

    } catch (error) {
        console.log(`error ${error}`)
        res.status(500).json({
            success:false,
            message:"Internal server error ",
            data:`error ${error}`
        });
        
    }

}

const addProblemsToPlayList = async (req,res) => {

    try {
        
        const {playlistId} = req.params;
        const {problemIds} = req.body;
        const userId = req.user.id;

        // find the ownership of playlist 
        const playList = await db.playlist.findUnique({
            where:{
                userId,
                id:playlistId
            }
        });

        if(!playList){
            return res.status(404).json({
                success:false,
                message:"sorry this is not your playlist",
            })
        }

         if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({
                success:false,
                message:"Invalid problemIds"
            })
         } 

        //  console.log(problemIds.map((problemId)=>({
        //     problemId,
        //     playlistId
        //  })))

         const problemsInPlayList = await db.problemInPlayList.createMany({
            data:problemIds.map((problemId)=>({
                playlistId:playlistId,
                problemId
            }))
         });

         res.status(201).json({
            success:true,
            message:"problems are added in PlayList ",
            data:problemsInPlayList
         })




    } catch (error) {
         console.log(`error ${error}`)
        res.status(500).json({
            success:false,
            message:"Internal server error "
        });
    }

    
}


const removeProblemFromPlayList = async (req,res) => {
   
    const {playlistId} = req.params;
    const {problemIds} = req.body;
    const userId = req.user.id;

    try {

        // check problemIds is arry 

        if(!Array.isArray(problemIds) || problemIds.length===0){
            return res.status(400).json({
                success:false,
                message:"Invalid problemIds"
            })
        }

        // check playlist belong to current loggedin user 
        const playList = await db.playlist.findUnique({
            where:{
                id:playlistId,
                userId
            }
        });

        if(!playList){
            return res.status(400).json({
                success:false,
                message:"this playlist is not yours"
            })
        }

        // remove problem from playlist
        
     const removedProblem =  await db.problemInPlayList.deleteMany({
        where:{
           playlistId:playlistId,
           problemId:{
            in:problemIds
           }
        }
        })

        res.status(201).json({
            success:false,
            message:"problems successfully removed from Playlist",
            data:removedProblem
        });

        
    } catch (error) {
         console.log(`error ${error}`)
        res.status(500).json({
            success:false,
            message:"Internal server error "
        });
    }


}


export {getAllPlayListDetails,getPlayListDetails,createPlayList,addProblemsToPlayList,removeProblemFromPlayList}