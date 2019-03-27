
  var currentTime = moment();
// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("hh:mm a");
    var trainFrequency = $("#frequency-input").val().trim();
   

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        frequency: trainFrequency,
        firstTrainTime: firstTrain,
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);
    console.log(newTrain.firstTrainTime);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#first-train-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrainTime;
    var min = childSnapshot.val().min;
    var next = childSnapshot.val().next;

    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFrequency);
    console.log(firstTrain);

    // Prettify the employee start
    var trainStartPretty = moment.unix(firstTrain).format("hh:mm a");

    // THE MATH!
    //subtracts the first train time back a year to ensure it's before current time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // the time difference between current time and the first train
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
  console.log(newTrain);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        // $("<td>").text(trainStartPretty),
        // $("<td>").text(firstTrain),
        $("<td>").text(nextTrain),
        $("<td>").text(minUntilTrain),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});
