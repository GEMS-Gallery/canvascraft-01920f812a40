import Text "mo:base/Text";

import Blob "mo:base/Blob";
import Result "mo:base/Result";

actor {
  // Store the latest image data
  stable var imageData : ?Blob = null;

  // Update the stored image data
  public func saveImage(data : Blob) : async Result.Result<(), Text> {
    imageData := ?data;
    #ok()
  };

  // Retrieve the stored image data
  public query func getImage() : async ?Blob {
    imageData
  };
}
