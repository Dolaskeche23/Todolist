const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err=> console.log(err));
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/todolistsDB");
}

const itemsSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "welcome"
});

const item2 = new Item({
    name: "Hit the + Button "
});

const item3 = new Item({
    name: " **delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/",function(req,res){

    Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
      
      
    })
    
    .catch(err => console.log(err));
 
});


app.post("/", function(req,res){
    const itemName = req.body.NewItem;
    const listName = req.body.list;
 const item = new Item({
    name : itemName
 });

 if(listName=== "Today"){
   item.save(); 
   res.redirect("/");
 }
 else{
    List.findOne({name: listName})
    .then(function(foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
    })
 }
});



app.post("/delete", function(req,res){
  const checkedItems = req.body.checkbox;
//   const listName = req.body.listName;

//   if(listName === "Today"){
    Item.deleteOne({_id: checkedItems })
    .then(result => {
      console.log("Succesfully Deleted the checked item!");
      res.redirect("/");
    })
//   }
//   else{
//     List.findOneAndUpdate({name: listName},{$pull: {items:{_id: checkedItems}}} )
//     .then(function(err,foundList){
//         if(!err){
//             res.redirect("/"+listName);
//         }
//     })
//   }

});


app.get("/:customListName",function(req,res){
    const customListName =_.capitalize(req.params.customListName);
   
    List.findOne({name:customListName})
      .then(function(foundList){
          
            if(!foundList){
              const list = new List({
                name:customListName,
                items:defaultItems
              });
            
              list.save();
              console.log("saved");
              res.redirect("/"+customListName);
            }
            else{
              res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
            }
      })
      .catch(function(err){});
      
  })

app.post("/work", function(){
    let item = req.body.NewItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function(req,res){
    console.log("server  started on port 3000");
});



// var currentDay = today.getDay();
//     var day = "";

//     switch (currentDay) {
//         case 0:
//             day = "Sunday";
//             break;
//         case 1:
//             day = "Monday";
//             break;
//         case 2:
//             day = "Tuesday";
//             break;
//         case 3:
//             day = "Wednesday";
//             break;
//         case 4:
//             day = "Thursday";
//             break;
//         case 5:
//             day = "Friday";
//             break;
//         case 6:
//             day = "Saturday";
//             break;
    
//         default:
//             console.log("Error : Current day is equal to: " + currentDay);
//     }