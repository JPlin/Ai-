var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true;
var chessBoard = [];
var over = false;

//赢法数组,是个三维数组
var wins = [];

//赢法的统计数组
var myWin = [];
var computerWin = [];


for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++)
		chessBoard[i][j] = 0;
}


for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
//赢法种类
var count = 0;

//所有的横线的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}

//所有的竖线的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}

//所有的斜线
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}

//所有的反斜线
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

console.log(count);
for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}


context.strokeStyle = "#bfbfbf";
context.globalAlpha = 0.8;

var logo = new Image();
logo.src = "logo.png";
logo.onload = function() {
	context.drawImage(logo, -32, -32, 510, 510);
	drawlines();
};

var drawlines = function() {
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
};

var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradident = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);

	if (me) {
		gradident.addColorStop(0, "#0A0A0A");
		gradident.addColorStop(1, "#636766");
	} else {
		gradident.addColorStop(0, "#fff");
		gradident.addColorStop(1, "#f3f3f3");
	}
	context.fillStyle = gradident;
	context.fill();

};

chess.onclick = function(e) {
	if (over || !me)
		return;
	var x = e.offsetX;
	var y = e.offsetY;

	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);

	if (chessBoard[i][j] === 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;

		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					window.alert("YOU WIN，Holy Shit!");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}
};

var computerAI = function() {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var x = 0,
		y = 0;
	for (var ii = 0; ii < 15; ii++) {
		myScore[ii] = [];
		computerScore[ii] = [];
		for (var jj = 0; jj < 15; jj++) {
			myScore[ii][jj] = 0;
			computerScore[ii][jj] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessBoard[i][j] === 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2200;
						} else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					x = i;
					y = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[x][y]) {
						x = i;
						y = j;
					}
				}

				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					x = i;
					y = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[x][y]) {
						x = i;
						y = j;
					}
				}
			}
		}
	}
	oneStep(x, y, false);
	chessBoard[x][y] = 2;

	for (var k = 0; k < count; k++) {
		if (wins[x][y][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				window.alert("I WIN，YOU ARE Holy Shit!");
				over = true;
			}
		}
	}
	if (!over) {
		me = !me;
	}
};
