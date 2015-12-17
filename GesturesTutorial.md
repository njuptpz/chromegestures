# How to make the Gesture #
Firstly find the GESTURES section of the document, it's at the top. This is where you add the actual movements and such that make up your gesture. Think up a simple name for your gesture, you'll be using this in each step. In this document, I will be assuming the name you've chosen is **your**.
You will see a list that looks fairly similar to the example line. You will probably want to ad your custom gesture to the end of it.
```
var yourGesture = ["left","right","up","down","click"];
```
  * Firstly you see the `var` part of this line. It MUST be there, and you may not change it. This is what tells the JavaScript you are declaring a new variable.
  * Next is the name of your variable, which is the name of your gesture (**your**) followed by the word Gesture.
  * The = sign is of course necessary as well.
  * Lastly is the list of your gestures. In the example I've listed the possible gestures. Now a list has to be surrounded by `[` and `]` and each entry must be separated by commas. Make sure to include the quotes when writing the gesture.

# How to make the Action #
Next up is the action, what the gesture will actually do. For this part, you need to know JavaScript. Scroll down to the ACTIONS section. The basic structure of your function is:
```
function yourAction(){
}
```
You must put all your JavaScript code between the { and the }

# How to link the gesture and action #
Scroll down to the RELATIONS section. You will see a list similar to the example given. Write it exactly like this, replacing only **your** with the name of your gesture.
```
myGestures[yourGesture] = yourAction;
```

# How to add your gesture to the help file #
This step is completely optional.<br />
Scroll down to the HELP section. You will be adding something like:
```
registerForHelp(
	yourGesture,
	"My first super cool gesture.",
	50,80,
	offsets...
);
```
  * Leave the first and last lines alone. You can collapse this if you want, I've only added line breaks to reference each argument better.
  * Line 2 is obviously the variable you declared in the first section, when you made your gesture.
  * Line 3 is the description of your gesture, what appears on the right side in the help file. You can add HTML here.
  * Line 4 and 5 is the information on drawing the image. This drawing is done on a 100 x 100 pixel HTMl 5 canvas. X expands right-ward while Y expands down-ward, just like in geometry class.
  * Line 4 is the starting position of the drawing, X and Y.
  * Each argument you supply after the starting Y relates respectively to the gesture in your list. ie. the first offset you supply corresponds to the first gesture you supply.
  * Each of these arguments is an offset from the last position, going in the direction of its corresponding gesture. If the gesture is "click", however, the "offset" is actually the radius of the circle to draw.
  * For instance, if you start at [20,20] and your gestures are ["right", "down"], and you supply it with 30,40 as the offsets. It will draw a line from [20,20] to [50,20] to [50,60]. Because it went 30 to the right of the origin, and then 40 down from the new position.

# Finishing up #
Once you're finished, don't forget to restart Chrome, and maybe share your gesture with everyone!