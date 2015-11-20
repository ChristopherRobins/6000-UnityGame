#pragma strict

public var cameraTarget : Transform;
private var x : float = 0.0f;
private var y : float = 0.0f;

private var mouseXSpeedMod : int = 7;
private var mouseYSpeedMod : int = 7;

public var maxViewDistance : float = 25;
public var minViewDistance : float = 1;
private var lerpRate : int = 5;
public var zoomRate : int = 30;
private var distance : float = 3;
private var desiredDistance : float;
private var correctedDistance : float;
private var currentDistance : float;

public var cameraTargetHeight : float = 1.0f;

function Start () {
  var angles = transform.eulerAngles;
		x = 180;
		y = 15;

    currentDistance = distance;
    desiredDistance = distance;
    correctedDistance = distance;
}

function LateUpdate () {

		x += Input.GetAxis("Mouse X") * mouseXSpeedMod;
		y -= Input.GetAxis("Mouse Y") * mouseYSpeedMod;

		y = ClampAngle(y, -50, 80);

		var rotation = Quaternion.Euler(y, x, 0);

		desiredDistance -= Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime * zoomRate * Mathf.Abs(desiredDistance);
		desiredDistance = Mathf.Clamp(desiredDistance, minViewDistance, maxViewDistance);
		correctedDistance = desiredDistance;

		var position = cameraTarget.position - ((rotation * Vector3.forward * desiredDistance));

        var collisionHit : RaycastHit;
        var cameraTargetPosition = new Vector3(cameraTarget.position.x, cameraTarget.position.y + cameraTargetHeight, cameraTarget.position.z);

         var isCorrected : boolean = false;
        if(Physics.Linecast(cameraTargetPosition, position, collisionHit)) {
            position = collisionHit.point;
            correctedDistance = Vector3.Distance(cameraTargetPosition, position);
            isCorrected = true;
        }

        currentDistance = !isCorrected || correctedDistance > currentDistance ? Mathf.Lerp(currentDistance, correctedDistance, Time.deltaTime * zoomRate) : correctedDistance;

        position = cameraTarget.position - (rotation * Vector3.forward * currentDistance + new Vector3(0, -cameraTargetHeight, 0));

		transform.rotation = rotation;
		transform.position = position;
	}

	private static function ClampAngle(angle : float, min : float, max : float) {
		if(angle < -360) {
			angle += 360;
		}
		if(angle > 360) {
			angle -= 360;
		}
		return Mathf.Clamp(angle, min, max);
	}
