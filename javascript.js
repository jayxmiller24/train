
  var currentTime = moment();
// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("hh:mm a");
    var trainFrequency = $("#frequency-input").val().trim();
   

   
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        frequency: trainFrequency,
        firstTrainTime: firstTrain,
    };

    
    database.ref().push(newTrain);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#first-train-input").val("");
});


database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrainTime;
    var min = childSnapshot.val().min;
    var next = childSnapshot.val().next;


    
    var trainStartPretty = moment.unix(firstTrain).format("hh:mm a");

    
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    /
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % trainFrequency;
    var minUntilTrain = trainFrequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTrain: firstTrain,
        frequency: trainFrequency,
        min: minUntilTrain,
        next: nextTrain
    }
  

    
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minUntilTrain),
    );

    
    $("#train-table > tbody").append(newRow);
});
