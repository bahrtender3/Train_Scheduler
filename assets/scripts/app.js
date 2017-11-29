(function () {
 // ------ Initialize Firebase --------

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBAN8QLmo9ul4SjqvpyaJD636i2lmJ0big",
        authDomain: "train-scheduler-411c3.firebaseapp.com",
        databaseURL: "https://train-scheduler-411c3.firebaseio.com",
        projectId: "train-scheduler-411c3",
        storageBucket: "train-scheduler-411c3.appspot.com",
        messagingSenderId: "1012547847882"
    };

    firebase.initializeApp(config);
    var database = firebase.database();
// -------------------------------------
   
    // --- Grabbing new train info ---
    var trainName = $('#train-name');
    var destination = $('#destination');
    var firstTrain = $('#first-train');
    var freq = $('#frequency');

    var trainTable = $('#train-table')


    var trainObject = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
    }


    var trainsRef = database.ref('trains');
    var trainadd = trainsRef.push();



    // --- grabs values and adds train to firebase ---
    function addTrain() {
        $('#add-train').on('click', function (event) {
            event.preventDefault();
            trainObject.name = trainName.val().trim();
            trainObject.destination = destination.val().trim();
            trainObject.firstTrain = firstTrain.val().trim();
            trainObject.frequency = freq.val().trim();
            
            // --- Adding Train to Firebase ---
            trainadd.set(trainObject)
            // --- clears the form after submit ---
            $('form').each(function () {
                this.reset();
            });
        })
    }


    // --- Listening for when a train is added to update the table --- 
    database.ref('trains').on('child_added', function (snap) {
        var result = snap.val();
        // --- Calculating the next time the train will come and how far away it is in Mins ---
        var timeCalcObj = {
            nextArrival: moment().add(result.frequency, 'm').format('HH:mm A'),
            minAway: moment().subtract(result.frequency, 'm').format('m')
        }
        trainTable.append(
            '<tr>' +
            '<td>' + result.name + '</td>' +
            '<td>' + result.destination + '</td>' +
            '<td>' + result.frequency + '</td>' +
            '<td>' + timeCalcObj.nextArrival + '</td>' +
            '<td>' + timeCalcObj.minAway + '</td>' +
            '</tr>'
        )
    })

    function main() {
        addTrain();
    }

    main();//main program run


}())