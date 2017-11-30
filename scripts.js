$(document).ready(function(){
	var database = firebase.database();
	var tokenRef = database.ref("CodesAcc");
	var currToken = "AB100";
	var currKey;
	var callKey;
	var callNum;
var repo = "/bitstokenplus";
	console.log(tokenRef);
	$(".dept-btn").click(function()
			{
				$(".dept-btn").removeClass("active");

				$(".dept-btn").find("span").removeClass("selected");
				$(this).addClass("active");
				$("span",this).addClass("selected");
				var x = $(this).find("a").html();
				var y;
				if(x == "Admin")
					y="/admin.html";	
				else if(x=="IT")
					y="/it.html";
				else if(x == "Accounts")
					y = "/accounts.html";
$("#implink").attr("href",repo+y);
$("#guestlink").attr("href",repo+"/guest"+y);

			});
	//Activates when the first child is removed
	tokenRef.limitToFirst(1).on("child_added", function(data)
			{
				//Updates token to be called
				callKey = data.key;
				callNum = data.val().Token;
				$("#call-token").html(callNum);
				$("#call-desc").html("Description: "+data.val().Comments);
				console.log(data.val());
				$("#time-slot").html("Time Slot: "+data.val()["Time Slot"]);

				//Updates the next two tokens to be called
				tokenRef.once("value", function(data)
						{
							var i = 0;
							data.forEach(function(childSnap)
									{
										var update = childSnap.val().Token;
										if(i==1)
											$("#token1").html(update);
										else if(i==2)
											$("#token2").html(update);
										if(i>2)
											return true; //forEach stops when the callback function returns true
										i++;

									});
						});
			});
	//Activates for all previously existing children as well as whenever a child is added
	tokenRef.on("child_added", function(data)
			{
				console.log("HI");
				currToken = data.val().Token;
				currKey = data.key;
				//Updates the next two tokens to be called
				tokenRef.once("value", function(data)
						{
							var i = 0;
							data.forEach(function(childSnap)
									{
										var update = childSnap.val().Token;
										if(i==1)
											$("#token1").html(update);
										else if(i==2)
											$("#token2").html(update);
										if(i>2)
											return true; //forEach stops when the callback function returns true
										i++;

									});
						});

			});

	//Adding tokens
	$("#add").click(function()
			{
				//Creating the new token alue
				var updatedToken = "AB" + (parseInt(currToken.substring(2))+1).toString();
				var timeAdded = firebase.database.ServerValue.TIMESTAMP;

				tokenRef.push({
					Comments: "Example comments for token: "+updatedToken,
					Time:timeAdded,
					Token: updatedToken
				});
			});
	//Removing tokens
	$("#remove").click(function(){
		tokenRef.child(callKey).remove();
	});
});
